from typing import List

def binary_search(array: List[int], target: int) -> int:
    left = 0
    right = len(array) -1

    while left <= right:
        middle = (left + right) // 2
        if array[middle] == target:
            return middle
        elif target > array[middle]:
            left = middle + 1
        else:
            right = middle - 1

    return -1