import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const slugs = ['waddle', 'robotic-arms', 'manumentor', 'hollow-knight'];

test('homepage, filtering, resume and contact', async ({ page, request }) => {
  const errors: string[] = [];
  page.on('pageerror', e=>errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Building robots.');
  await expect(page.locator('[data-category]:visible')).toHaveCount(4);
  await page.getByRole('button', { name: 'Robotics', exact: true }).click();
  await expect(page.locator('[data-category]:visible')).toHaveCount(2);
  await expect(page.getByRole('button', {name:'Robotics',exact:true})).toHaveAttribute('aria-pressed','true');
  await page.getByRole('button', { name: 'AI/software', exact: true }).click();
  await expect(page.locator('[data-category]:visible')).toHaveCount(2);
  await expect(page.locator('[data-category]:visible').first()).toContainText('ManuMentor');
  await page.getByRole('button', { name: 'All', exact: true }).click();
  await expect(page.locator('[data-category]:visible')).toHaveCount(4);
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('link', {name: 'Resume',exact:true}).click();
  expect((await downloadPromise).suggestedFilename()).toBe('Abbas_Quettawala_Resume.pdf');
  const resume=await request.get('/resume.pdf');
  expect(resume.ok()).toBeTruthy();
  expect((await resume.body()).subarray(0,5).toString()).toBe('%PDF-');
  await expect(page.getByRole('link',{name:'Email Abbas'})).toHaveAttribute('href','mailto:abbasquettawalla@gmail.com');
  expect(errors).toEqual([]);
});

test('every case study loads directly, refreshes and links onward', async ({ page }) => {
  for(const slug of slugs){
    const response=await page.goto(`/projects/${slug}/`);
    expect(response?.status()).toBe(200);
    await expect(page.locator('.prose')).toContainText('My part');
    await page.reload();
    await expect(page.getByRole('link',{name:'← All projects'})).toBeVisible();
    await page.locator('.next-project').click();
    await expect(page.locator('.case-header h1')).toBeVisible();
  }
});

test('robot supports pose controls, dragging, keyboard and reset', async ({ page }) => {
  await page.goto('/');
  const robot=page.locator('[data-robot]');
  await expect(robot).toHaveAttribute('data-ready','true');
  await page.getByRole('button',{name:'Head tilt'}).click();
  await expect(robot).toHaveAttribute('data-pose','tilt');
  await page.getByRole('button',{name:'Crouch'}).click();
  await expect(robot).toHaveAttribute('data-pose','crouch');
  const canvas=robot.locator('canvas');
  const before=await canvas.screenshot();
  await canvas.focus();await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(350);
  expect((await canvas.screenshot()).equals(before)).toBeFalsy();
  const box=await canvas.boundingBox();
  if(box){await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2+70,box.y+box.height/2,{steps:5});await page.mouse.up();}
  await page.getByRole('button',{name:'Reset robot pose and rotation'}).click();
  await expect(robot).toHaveAttribute('data-pose','reset');
  await expect(robot.locator('[role=status]')).toContainText('Neutral pose');
});

for(const width of [375,768,1440]){
  test(`responsive layout and screenshot at ${width}px`,async({page})=>{
    await page.setViewportSize({width,height:1000});
    await page.goto('/');
    await expect(page.locator('[data-robot]')).toHaveAttribute('data-ready','true');
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
    await page.screenshot({path:`test-results/home-${width}.png`,fullPage:true});
    for(const slug of slugs){
      await page.goto(`/projects/${slug}/`);
      expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
    }
    await page.screenshot({path:`test-results/case-${width}.png`,fullPage:true});
  });
}

test('reduced motion keeps static illustration and working navigation',async({page})=>{
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto('/');
  await expect(page.locator('[data-fallback]')).toBeVisible();
  await expect(page.locator('[data-controls]')).toBeHidden();
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.getByRole('link',{name:'Explore Waddle',exact:true}).click();
  await expect(page.locator('h1')).toContainText('Waddle');
});

test('no JavaScript still provides projects, resume and navigation',async({browser})=>{
  const context=await browser.newContext({javaScriptEnabled:false});
  const page=await context.newPage();
  await page.goto('http://127.0.0.1:4321/');
  await expect(page.locator('[data-category]:visible')).toHaveCount(4);
  await expect(page.locator('[data-filters]')).toBeHidden();
  await expect(page.locator('[data-fallback]')).toBeVisible();
  await page.getByRole('link',{name:'Explore Waddle',exact:true}).click();
  await expect(page.locator('.prose')).toBeVisible();
  await context.close();
});

test('WebGL failure leaves a usable static drawing',async({page})=>{
  await page.addInitScript(()=>{
    const original=HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext=function(this:HTMLCanvasElement,kind:string,...args:unknown[]){
      if(kind==='webgl'||kind==='webgl2'||kind==='experimental-webgl')return null;
      return (original as Function).apply(this,[kind,...args]);
    } as typeof HTMLCanvasElement.prototype.getContext;
  });
  await page.goto('/');
  await page.waitForTimeout(800);
  await expect(page.locator('[data-fallback]')).toBeVisible();
  await expect(page.locator('[data-controls]')).toBeHidden();
  await expect(page.locator('[data-category]:visible')).toHaveCount(4);
});

test('changing motion preference disposes and restores the interactive model',async({page})=>{
  await page.goto('/');
  await expect(page.locator('[data-robot]')).toHaveAttribute('data-ready','true');
  await page.emulateMedia({reducedMotion:'reduce'});
  await expect(page.locator('[data-fallback]')).toBeVisible();
  await expect(page.locator('canvas')).toHaveCount(0);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await expect(page.locator('[data-robot]')).toHaveAttribute('data-ready','true');
  await expect(page.locator('canvas')).toHaveCount(1);
});

test('keyboard focus and automated accessibility checks',async({page})=>{
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
  for(const url of ['/',...slugs.map(s=>`/projects/${s}/`)]){
    await page.goto(url);
    const result=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
    expect(result.violations,JSON.stringify(result.violations,null,2)).toEqual([]);
  }
});

test('internal links resolve and custom not-found page is present',async({page,request})=>{
  const urls=new Set<string>();
  for(const path of ['/',...slugs.map(s=>`/projects/${s}/`)]){
    await page.goto(path);
    for(const url of await page.locator('a[href^="/"]').evaluateAll(links=>links.map(a=>(a as HTMLAnchorElement).pathname)))urls.add(url);
  }
  for(const url of urls)expect((await request.get(url)).ok(),url).toBeTruthy();
  await page.goto('/404.html');
  await expect(page.locator('h1')).toContainText('wrong turn');
});
