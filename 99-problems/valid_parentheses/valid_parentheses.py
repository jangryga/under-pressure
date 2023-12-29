def valid_parentheses(s: str) -> bool:
    ps = {
        ")": "(",
        "]": "[",
        "}": "{"
    }
    opening = set(ps.values())
    stack  = []
    s = list(reversed(s))

    while s:
        ch = s.pop()
        if ch in opening:
            stack.append(ch)
        else:
            if not stack or stack[-1] != ps[ch]:
                return False
            stack.pop()
    
    return not stack