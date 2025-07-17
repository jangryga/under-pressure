from typing import List

def equilibrium_index(array: List[int]) -> int:
    total_sum = sum(array)
    left_sum = 0
    
    for i, val in enumerate(array):
        if left_sum == total_sum - left_sum - val: return i
        left_sum += val 
    
    return -1