# Implementation Details

This document describes key implementation details of OpenCode Bridge.

---

## 1. Permission Request Response

- In `permission.asked`, `tool` may not be a string tool name; actual whitelist matching may fall on the `permission` field
- The response interface requires `response` to be `once | always | reject`, not `allow | deny`

---

## 2. Question Tool Interaction

- Questions are rendered as Feishu cards; answers are parsed from user text replies
- After parsing, responses are sent back as `answers: string[][]` required by OpenCode
- Answers are included in undo history for consistency

---

## 3. Streaming and Thinking Cards

- Text and thinking are written to output buffer separately
- Card mode switches automatically when thinking content appears
- Cards support expand/collapse for thinking content
- Final state retains completion status

---

## 4. `/undo` Consistency

- Requires deleting platform-side message and executing `revert` on OpenCode simultaneously
- Q&A scenarios may involve multiple associated messages
- Uses recursive rollback as fallback for complex scenarios

---

## 5. Private Chat Group Creation Card Interaction

- Dropdown selection action only records session selection
- Does not depend on card redraw
- Behavior consistent with `/panel` dropdown interaction
- Group creation and binding are executed only when clicking "Create Group"
- Avoids misbinding due to card state synchronization

---

## 6. `/clear free session` Behavior

- This command does not create a separate cleanup rule
- Reuses lifecycle scan logic
- Can trigger cleanup scan without process restart

---

## 7. File Sending to Feishu

- `/send <absolute path>` directly calls Feishu upload API
- Does not go through AI, zero latency
- Images (.png/.jpg/.gif/.webp, etc.) use image channel (limit 10MB)
- Other files use file channel (limit 30MB)
- Consistent with Feishu official limits

### Security Policy

- Built-in sensitive file blacklist (.env, id_rsa, .pem, etc.)
- Only allows sending files within `ALLOWED_DIRECTORIES` whitelist
- When `ALLOWED_DIRECTORIES` is not configured, `/send` is rejected by default

---

## 8. Directory Policy (DirectoryPolicy)

All session creation entry points go through `DirectoryPolicy.resolve()` 9-stage validation pipeline:

### Validation Stages

1. **Priority Merge**: Merge directory candidates from all sources
2. **Format Check**: Check path format and length
3. **Normalization**: Standardize separators, remove redundant parts
4. **Danger Block**: Reject sensitive paths like /etc, /root
5. **Whitelist Check**: Validate against `ALLOWED_DIRECTORIES`
6. **Existence Pre-check**: Check if directory exists
7. **realpath Resolution**: Resolve symbolic links to real paths
8. **Git Root Normalization**: Normalize to Git repository root
9. **Post-normalization Check**: Re-validate whitelist after normalization

### Directory Priority

1. Explicit input directory (command parameter)
2. Project alias (PROJECT_ALIASES)
3. Group default directory (session binding storage)
4. Global default directory (DEFAULT_WORK_DIRECTORY)
5. OpenCode server default directory

### Security Defaults

- When `ALLOWED_DIRECTORIES` is not configured, users cannot customize paths
- Error messages are sanitized; full paths only appear in server logs