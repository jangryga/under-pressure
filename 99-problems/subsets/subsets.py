from typing import List

def subsets(nums: List[int]) -> List[List[int]]:
    sets = [[]]

    def helper(sets, arr, start_idx):
        if start_idx == len(nums): return

        helper(sets, [n for n in arr], start_idx + 1)
        cp = [n for n in arr]
        cp.append(nums[start_idx])
        sets.append(cp)
        helper(sets, cp, start_idx +1)

    helper(sets, [], 0)

    return sets
