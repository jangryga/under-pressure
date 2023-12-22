from typing import List
import time

def eating_bananas(piles: List[int], h: int) -> int:
    low_speed = 1
    max_speed = max(piles)
    best_speed = float("inf")
    
    while low_speed <= max_speed:
        curr_speed = (low_speed + max_speed) // 2
        inner_count = 0
        for p in piles:
            inner_count += -(-p // curr_speed)

        if inner_count <= h:
            best_speed = min(best_speed, curr_speed)
            max_speed = curr_speed - 1
        else:
            low_speed = curr_speed + 1

    return best_speed

