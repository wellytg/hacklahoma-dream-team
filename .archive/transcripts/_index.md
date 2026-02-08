# Conversation Transcripts Archive

This directory contains verbatim transcripts of development conversations for hacklahoma-dream-team. Each transcript is a complete record of dialogue, tool usage, and outcomes.

## Latest Conversation
**Current**: 1

## Conversation Index

### Examples and References
See llm-dev documentation for transcript format and examples.


### 001 - Project Init and MVP Scoping
**File**: 20260207-project-init-and-mvp-scoping.json
**Date**: February 7, 2026
**Participants**: Dallas Elleman (@DallasElleman), Claude Opus 4.5 (claude-opus-4-6)
**Topics**: project setup, git configuration, MVP scoping, hackathon planning
**Outcomes**: Created 2 file(s)

## Transcript Format

Transcripts are stored as JSON documents containing:
- `project_id`: Project identifier
- `conversation_id`: Unique conversation ID (YYYYMMDD-title-in-kebab-case)
- `conversation_number`: Session number from initialization
- `date`: Date and time of conversation (ISO 8601)
- `participants`: Array of participant information
- `dialogue`: Verbatim conversation with tool calls
- `outcomes`: Files created/modified and decisions made

## How to Use This Directory

- **For Full Context**: Read complete transcripts for detailed understanding
- **For Changes**: Check referenced changelogs for specific project changes
- **For Cross-Project**: Multi-project conversations reference all affected projects
- **For Artifacts**: Check `.archive/artifacts/` for files created during conversations

## Maintenance

Transcripts are created using `/llm-dev:create-transcript`:
1. Converts Claude Code JSONL to llm-dev JSON format
2. Preserves verbatim dialogue and tool calls
3. Replaces session placeholder with actual summary
4. Updates changelog with reverse-chronological entry
