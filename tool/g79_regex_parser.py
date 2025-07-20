import json
import re


def unescape_line(s):
    def replacer(match):
        # TODO: implement unescape
        hex_code = match.group(1)
        code_point = int(hex_code, 16)
        return chr(code_point)

    # Match \x{XXXX}
    return re.sub(r"\\x\{([0-9a-fA-F]+)\}", replacer, s)


def sort_dict_by_key(d):
    out = []
    for key in sorted(d.keys()):
        out.append(unescape_line(d[key]))
    return out


with open("g79_regex.json", "r", encoding="utf-8") as f:
    data = json.load(f)

regexs = data["regex"]
dicts = {}

for key, value in regexs.items():
    dicts[key] = sort_dict_by_key(value)

for key, value in dicts.items():
    with open(f"{key}.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(value))
