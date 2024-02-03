from typing import List

def subsets(nums: List[int]) -> List[List[int]]:
    subsets = [[]]
    for i in range(len(nums)):
        subsets.extend(subsets(nums, i+1))

    return subsets


def get_combinations(array: List[int], l: int) -> List[List[int]]:
    return []