import os

setup_script = """
    sudo apt install portaudio19-dev -y
    pip3 install -r requirements.txt
"""

os.system(setup_script)