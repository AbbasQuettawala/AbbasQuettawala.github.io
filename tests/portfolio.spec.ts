import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const slugs = ['waddle', 'robotic-arms', 'manumentor', 'hollow-knight'];

test('About section presents reviewed personal photos across screen sizes',async({page,request})=>{
  for(const width of [375,768,1440]){
    await page.setViewportSize({width,height:1000});
    await page.goto('/#about');
    await expect(page.locator('#about img')).toHaveCount(3);
    await expect(page.locator('#about .about-monogram')).toHaveCount(0);
    for(const img of await page.locator('#about img').all()){
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveAttribute('loading','lazy');
      await expect.poll(()=>img.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBeTruthy();
      expect((await img.getAttribute('alt'))?.length).toBeGreaterThan(20);
    }
    for(const link of await page.locator('#about a[href^="/media/about/"]').all()){
      expect((await request.get((await link.getAttribute('href'))!)).ok()).toBeTruthy();
    }
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
    await page.locator('#about').screenshot({path:`test-results/about-${width}.png`});
  }
});

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

test('robotic arms uses real photographs and playable, opt-in demonstration clips', async ({page,request})=>{
  test.setTimeout(90_000);
  await page.goto('/');
  const card=page.locator('.project-arms .project-image');
  await expect(card.locator('img')).toHaveAttribute('src','/media/robotic-arms/completed-arms-card.webp');
  await expect(card).not.toContainText('CONCEPT DIAGRAM');
  await card.click();
  await expect(page.locator('h1')).toContainText('Ten 6-DOF robotic arms');
  await expect(page.locator('.case-photo img')).toBeVisible();
  await page.getByRole('link',{name:'See photos & demonstrations ↓'}).click();
  await expect(page.locator('#media-heading')).toBeInViewport();
  await expect(page.locator('.case-gallery video')).toHaveCount(4);
  await expect(page.locator('.case-gallery img')).toHaveCount(4);
  for(const img of await page.locator('.case-photo img,.case-gallery img').all()){
    await img.scrollIntoViewIfNeeded();
    await expect.poll(()=>img.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBeTruthy();
  }
  for(const video of await page.locator('video').all()){
    await expect(video).toHaveAttribute('preload','none');
    expect(await video.getAttribute('autoplay')).toBeNull();
    expect(await video.getAttribute('controls')).not.toBeNull();
    expect(await video.getAttribute('playsinline')).not.toBeNull();
    const poster=await video.getAttribute('poster');
    expect((await request.get(poster!)).ok()).toBeTruthy();
    await video.evaluate((el:HTMLVideoElement)=>el.load());
    await expect.poll(()=>video.evaluate((el:HTMLVideoElement)=>el.readyState)).toBeGreaterThanOrEqual(2);
    expect(await video.evaluate((el:HTMLVideoElement)=>el.duration)).toBeGreaterThan(4);
    await video.evaluate(async(el:HTMLVideoElement)=>{el.muted=true;await el.play();});
    await expect.poll(()=>video.evaluate((el:HTMLVideoElement)=>el.currentTime)).toBeGreaterThan(0);
    await video.evaluate((el:HTMLVideoElement)=>el.pause());
  }
  for(const width of [375,768,1440]){
    await page.setViewportSize({width,height:1000});
    await page.reload();
    for(const img of await page.locator('.case-gallery img').all()){
      await img.scrollIntoViewIfNeeded();
      await expect.poll(()=>img.evaluate((el:HTMLImageElement)=>el.complete&&el.naturalWidth>0)).toBeTruthy();
    }
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth)).toBeTruthy();
    await page.screenshot({path:`test-results/arms-${width}.png`,fullPage:true});
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
