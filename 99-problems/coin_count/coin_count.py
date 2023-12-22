from typing import List

def coin_count(coins: List[int], amount: int) -> int:
    all_coins = [float("inf") for _ in range(amount + 1)]
    all_coins[0] = 0
    
    for idx in range(amount + 1):
        curr_min = float("inf")
        for coin in coins:
            if idx - coin < 0:
                continue
            curr_min = min(curr_min, 1 + all_coins[idx - coin])
        if curr_min != float("inf"):
            all_coins[idx] = curr_min

    return all_coins[-1] if all_coins[-1] != float("inf") else -1