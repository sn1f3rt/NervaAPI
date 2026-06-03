def calculate_seconds_from_time_string(time_string: str) -> int:
    """Convert a space-separated time string to a number of seconds.

    Tokens are summed and may use the suffixes ``s`` (seconds), ``m`` (minutes),
    ``h`` (hours) and ``d`` (days), e.g. ``"1h 30m"`` -> ``5400``. Unrecognised
    tokens contribute nothing.
    """
    seconds: int = 0

    for token in time_string.split(" "):
        if token.endswith("s"):
            seconds += int(token[:-1])
        elif token.endswith("m"):
            seconds += int(token[:-1]) * 60
        elif token.endswith("h"):
            seconds += int(token[:-1]) * 3600
        elif token.endswith("d"):
            seconds += int(token[:-1]) * 86400

    return seconds
