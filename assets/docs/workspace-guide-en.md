# Working Directory and Project Strategy Guide

This document describes the working directory strategy, command entry points, and security constraints.

---

## 1. Design Goals

- Allow users to securely select working directories from chat interface
- Maintain consistent behavior across platforms: configurable directories, inheritable sessions, traceable permissions
- Avoid "task stuck after directory switch" instance mismatch issues

---

## 2. Directory Priority

When creating or switching sessions, directory sources are resolved in this priority:

1. **Explicit input** (command argument / card input)
2. **Project aliases** (`PROJECT_ALIASES`)
3. **Group default** (session-bound storage)
4. **Global default** (`DEFAULT_WORK_DIRECTORY`)
5. **OpenCode server default**

Implementation: `src/utils/directory-policy.ts`

---

## 3. Security Rules

Directory decisions go through a complete validation pipeline:

### Validation Steps

1. Path format and length checks
2. Dangerous path interception
3. Whitelist checks (`ALLOWED_DIRECTORIES`)
4. Existence and accessibility checks
5. realpath resolution and secondary whitelist check
6. Git root normalization and re-validation

### Security Defaults

- When validation fails, users see a generic message
- Full paths are only logged server-side
- Unconfigured `ALLOWED_DIRECTORIES` blocks custom paths

---

## 4. Directory Sources for /create_chat

The "working project (optional)" dropdown in Feishu private chat `create_chat` panel combines:

- `DEFAULT_WORK_DIRECTORY`
- `ALLOWED_DIRECTORIES`
- Existing session directories (historical and bound sessions)
- Project aliases (`PROJECT_ALIASES`)

Even without historical projects, the dropdown retains a "follow default project" option.

---

## 5. Platform Command Entry Points

### Feishu

| Command | Description |
|---------|-------------|
| `/project list` | List available projects |
| `/project default` | View current group default |
| `/project default set <path\|alias>` | Set group default |
| `/project default clear` | Clear group default |
| `/session new <path\|alias>` | Create session with directory |
| `/create_chat` | Card-based session/directory selection |

### Discord

| Command | Description |
|---------|-------------|
| `///workdir` | View current working directory |
| `///workdir <path\|alias>` | Set working directory |
| `///workdir clear` | Clear working directory |
| `///new [name] [--dir path\|alias]` | Create with directory |
| `///new-channel [name] [--dir path\|alias]` | Create channel with directory |
| `///create_chat` | Dropdown session control |

---

## 6. Environment Variables

### Minimum Recommended Configuration

```env
ALLOWED_DIRECTORIES=/path/to/projects,/path/to/repos
DEFAULT_WORK_DIRECTORY=/path/to/projects/default
PROJECT_ALIASES={"bridge":"/path/to/opencode-bridge"}
GIT_ROOT_NORMALIZATION=true
```

### Configuration Notes

- Unconfigured `ALLOWED_DIRECTORIES` restricts user custom path capability
- `PROJECT_ALIASES` should only contain commonly used projects to avoid dropdown clutter
- Paths are validated against whitelist after normalization

---

## 7. Permission and Directory Consistency

Permission responses include directory candidates:

1. **Priority**: Current session directory (`resolvedDirectory/defaultDirectory`)
2. **Fallback**: Known directory list
3. **Final**: Default directory instance

This reduces permission confirmation deadlocks after directory switches.

---

## 8. Common Issues

### Q: Why is my directory not allowed?

- Check if path is within `ALLOWED_DIRECTORIES`
- Check if realpath-resolved path is still within whitelist (common with symlinks)

### Q: Why can't I see historical projects in /create_chat?

- Directory may be filtered by whitelist
- Non-existent or unreadable directories are automatically excluded

### Q: Directory switched but permission "allowed" but task didn't continue?

- Check logs for whether permission response hit directory candidates
- Confirm OpenCode instance matches current session directory

---

## 9. Maintenance Recommendations

- Directory-related changes must include tests (directory policy + panel options + permission response)
- Before release, at minimum run `npm run build` and `npm test`
- Directory policy changes should sync `.env.example` and README environment variable sections