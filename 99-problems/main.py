from test_runner.runner import TestRunner
import argparse

def main(test_name):
    tr = TestRunner(test_name)
    tr.run()

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-t","--test-name", help="Run a single test with given problem name", type=str)
    args = parser.parse_args()
    test_name = args.test_name

    main(test_name)