---
title: ManuMentor
subtitle: Making engineering knowledge useful.
summary: A collaborative manufacturing AI assistant connecting technical documents, test data and knowledge graphs to support troubleshooting.
order: 3
category: AI/software
organisation: CSIRO · undergraduate studentship
role: Collaborative development · research & ethics-trial support
status: Research & development
tags: [Python, FastAPI, Vue 3, RAG, Memgraph]
illustration: manumentor
---
## The challenge

Manufacturing knowledge is spread across manuals, test records and the relationships between subsystems. ManuMentor brings those sources together to help engineers ask questions and investigate faults with more context.

## My part

I work collaboratively on ManuMentor with the project team. The system uses a Vue 3 frontend and Python/FastAPI backend, combining document ingestion, vector retrieval and Memgraph knowledge graphs. I also co-authored a research paper and assisted with the project’s ethics trials.

Earlier work included a weld-data explorer and local inference prototypes. The current platform has evolved beyond those implementations; this case study describes our collaborative system, not sole authorship of every component.

## How the system fits together

- OCR-based ingestion turns technical PDFs into retrievable text chunks.
- Embeddings and vector search locate relevant document content.
- Structured test records complement unstructured documentation.
- Authored subsystem graphs connect symptoms, checks and engineering relationships.
- Source-backed responses and interactive checks support a guided fault investigation.

The current system uses Memgraph rather than the vector database described in earlier project material. Automatic graph extraction is optional; the main troubleshooting graph is authored.

## Progress & boundaries

The repository implements document retrieval and graph-assisted troubleshooting. That does not establish measured diagnosis accuracy, production reliability or time savings. This public-facing overview intentionally excludes private documents, datasets, infrastructure details and unapproved screenshots.

## Next for this case study

Add an approved, sanitised walkthrough using a non-sensitive example. Evaluation results will only be included when they have been checked and cleared for sharing.
