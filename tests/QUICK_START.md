# QuLearn UI Tests - Quick Start Guide

Get up and running with QuLearn UI tests in 5 minutes.

## Prerequisites

- Python 3.8+ installed
- QuLearn application running on `http://localhost:5173`
- Chrome or Firefox browser

## Setup (First Time Only)

### Windows

```bash
# 1. Navigate to tests directory
cd C:\Users\viduranga\Documents\GitHub\qulearn-frontend\tests

# 2. Create virtual environment
python -m venv venv

# 3. Activate virtual environment
venv\Scripts\activate

# 4. Install dependencies
pip install -r requirements.txt
```

### macOS/Linux

```bash
# 1. Navigate to tests directory
cd tests

# 2. Create virtual environment
python3 -m venv venv

# 3. Activate virtual environment
source venv/bin/activate

# 4. Install dependencies
pip install -r requirements.txt
```

## Running Tests

### Before Each Test Run

Ensure QuLearn is running:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Verify: Open browser to `http://localhost:5173`

### Run All Tests

```bash
# Activate virtual environment first
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Run tests
pytest
```

### Run Specific Tests

```bash
# Login tests only
pytest test_login.py

# Registration tests only
pytest test_register.py

# Quick smoke tests
pytest -m smoke

# Verbose output
pytest -v
```

### Common Options

```bash
# Run in headless mode (no browser window)
pytest --headless

# Use Firefox instead of Chrome
pytest --browser=firefox

# Generate HTML report
pytest --html=reports/test_report.html

# Run faster with parallel execution
pytest -n 4
```

## Expected Output

```
================================ test session starts ================================
platform win32 -- Python 3.11.0, pytest-7.4.3, pluggy-1.3.0
rootdir: C:\Users\viduranga\Documents\GitHub\qulearn-frontend\tests
collected 20 items

test_login.py ..........                                                      [ 50%]
test_register.py ..........                                                   [100%]

================================ 20 passed in 45.23s ================================
```

## Troubleshooting

### "Command not found: pytest"

**Fix:** Ensure virtual environment is activated:
- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

### "ConnectionRefusedError"

**Fix:** Start QuLearn application:
```bash
npm run dev
```

### "ChromeDriver download failed"

**Fix:** Check internet connection and retry. Driver downloads automatically.

### Tests timeout

**Fix:** Your application might be slow. Increase timeout in `conftest.py`:
```python
web_driver.implicitly_wait(20)  # Change from 10 to 20
```

## Test Credentials

Built into tests:
- **Student:** `student@student.lk` / `student`
- **Educator:** `educator@educator.lk` / `educator`

## Next Steps

1. Review full documentation: `README.md`
2. Check test reports: `reports/test_report.html`
3. Explore test files: `test_login.py`, `test_register.py`

## Quick Reference

| Command | Purpose |
|---------|---------|
| `pytest` | Run all tests |
| `pytest -v` | Verbose output |
| `pytest -m smoke` | Quick tests only |
| `pytest --headless` | No browser window |
| `pytest test_login.py` | Run one file |
| `pytest -n 4` | Parallel execution |
| `pytest --html=reports/report.html` | Generate report |

---

**Need Help?** Check `README.md` for detailed documentation and troubleshooting.
