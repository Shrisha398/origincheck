from selenium import webdriver
from selenium.webdriver.chrome.options import Options

options = Options()
options.add_experimental_option("detach", True)

driver = webdriver.Chrome(options=options)

driver.get("http://127.0.0.1:4173/")

print("Page Title:", driver.title)
print("Website URL:", driver.current_url)

if "origincheck" in driver.title.lower():
    print("TEST PASSED: OriginCheck website opened successfully.")
else:
    print("TEST FAILED: Page title does not contain OriginCheck.")