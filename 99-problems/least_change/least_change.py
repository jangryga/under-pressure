from typing import List

def least_change(coins: List[int], amount: int) -> int:
    coins.sort(reverse=True)
    memory = {0: 0}
    def helper(coins, amount):
        coin_count = 0
        if amount in memory:
            return memory[amount]
        if amount < 0:
            return float("inf")
        local_min = float("inf")
        for coin in coins:
            curr_count = 1 + helper(coins, amount - coin)
            local_min = min(local_min, curr_count)
        memory[amount] = local_min
        return local_min
    
    best = helper(coins, amount)
    return best if best < float("inf") else -1