from typing import List, Optional
import os
import json
import unittest
import importlib

EXCLUDED_PACKAGES = ["test_runner", ".git", "editor", "__pycache__"]

class TestSuite(unittest.TestCase):
    pass

class TestRunner:

    def __init__(self, test_name: Optional[str]):
        self.test_name = test_name
        self.packages = []

    def walk_packages(self) -> List[str]:
        print("Walking directory tree")
        for d_path, d_names, _ in os.walk("."):
            if d_path == ".":
                self.packages = [name for name in d_names if name not in EXCLUDED_PACKAGES]
        if self.test_name:
            self.packages = [self.test_name] if self.test_name in self.packages else []
            
    def create_tests(self):
        print("Creating tests")

        def make_test_method(path_name):
            module = importlib.import_module(f"{path_name}.{path_name}")
            file_name = f"./{path_name}/test_data.json"
            try:
                func = getattr(module, path_name)
            except AttributeError:
                func = lambda *args: f"AttributeError no function {path_name} found"

            def test(cls):
                if not os.path.exists(file_name):
                    cls.fail(f"{file_name} Not Found")
                with open(file_name, "r") as f:
                    runs = json.loads(f.read())
                for run in runs:
                    try:
                        cls.assertEqual(func(**run["input"]), run["output"])
                    except Exception as e:
                        print(f"\n[ERROR] Failed {func.__name__}: \n    [INPUT]    {run['input']}\n    [EXPECTED] {run['output']}\n    [MESSAGE]  {e}")
            return test
        
        for path_name in self.packages:
            test_name = f"test_{path_name}"
            setattr(TestSuite, test_name, make_test_method(path_name))

        print(f"    Created {len(self.packages)} tests")

    def execute_tests(self):
        print("Executing tests")
        suite = unittest.TestLoader().loadTestsFromTestCase(TestSuite)
        unittest.TextTestRunner().run(suite)


    def run(self):
        print("Starting execution...")
        self.walk_packages()
        self.create_tests()
        self.execute_tests()
