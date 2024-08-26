* [ ] Handle empty user prompts
* [ ] add logging

  * [ ] use

  * ```
    import logging
    logging.basicConfig(format='[%(asctime)s] p%[process]s {%(filename)s:$(lineno)} %(levelname)s - %(message)s', level=logging.INFO )
    logger = logging.getLogger(__name__)
    ```
* [ ] add timestamp for when user ask question
* [ ] add timestamp for when agent responds

  * [ ] for both timestamp related task use `import time`
* [ ] if youd like to create different sessions maybe use uuid for the ids of the session

  * [ ] use `import uuid`
* [ ] Make a dropdown option for picking different LLMs
* [ ] Fix the html tags not showing in the syntax highlighting.. its something with how i do it on the server side
* [ ] add loading animation for the ai response
