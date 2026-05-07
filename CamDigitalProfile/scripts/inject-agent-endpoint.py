#!/usr/bin/env python3
"""
Amplify build helper: inject PORTFOLIO_AGENT_CHAT_URL into index.html meta.

Set in Amplify → Environment variables (build time), e.g.:
  PORTFOLIO_AGENT_CHAT_URL=https://xxxx.lambda-url.us-east-1.on.aws/api/agent/chat

Full URL including path. If unset, leaves meta empty (same-origin /api/agent/chat).
"""
from __future__ import annotations

import html
import os
import pathlib
import re
import sys


def main() -> int:
    url = (os.environ.get("PORTFOLIO_AGENT_CHAT_URL") or "").strip()
    here = pathlib.Path(__file__).resolve().parent
    index = here.parent / "index.html"
    if not index.is_file():
        print(f"inject-agent-endpoint: missing {index}", file=sys.stderr)
        return 1

    text = index.read_text(encoding="utf-8")
    if not url:
        print("inject-agent-endpoint: PORTFOLIO_AGENT_CHAT_URL not set; leaving cam-agent-chat-endpoint empty.")
        return 0

    esc = html.escape(url, quote=True)
    pattern = r'(<meta\s+name="cam-agent-chat-endpoint"\s+content=")[^"]*("\s*/>)'

    def repl(m: re.Match[str]) -> str:
        return m.group(1) + esc + m.group(2)

    new_text, n = re.subn(pattern, repl, text, count=1)
    if n != 1:
        print("inject-agent-endpoint: could not find <meta name=\"cam-agent-chat-endpoint\" ...> in index.html", file=sys.stderr)
        return 1

    index.write_text(new_text, encoding="utf-8")
    print("inject-agent-endpoint: wrote cam-agent-chat-endpoint into index.html")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
