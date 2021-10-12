**❗️ Please be aware that there is no released version yet. Some information of the README is simply wrong for the moment because not the actual but the desired state is described here.**

---

# THIS IS MALLARD!

## What is mallard? 🦆
Mallard is a tool that helps you test your several API versions. Imagine you migrate your software and want to make sure that your new API endpoints still return the same results as your old ones – simple: use mallard. It creates a proxy server for you that will take all the client's requests, send them to your old API and return the result to the client while also duplicating that exact request and sending it to your new one. Then it compares the results for you and processes them for you so you can easily find out where your software doesn't quite work yet. Awesome, right?

## How to use it. 🛠
Mallard comes as a docker image. All you need to do is pull it, create a container and then run it. That's it.

## How it works. 🦾
<p align="center"><img src="https://user-images.githubusercontent.com/59147426/137020922-4109fdb7-6556-4d93-9684-29f56c2ec939.png" alt="drawing" width="400"/></p>

As mentioned already mallard is nothing more but a proxy between clients and your APIs. As shown in the following image it accepts requests, sends them to the *actual* server and returns the response to the client. While doing so it also duplicates the request and sends it to other versions of you API so that it can then compare the results, process them for you and present them in a nice UI.

## I want to contribute! 🙋‍♀️
Great! If you just want to propose a feature, report a bug or similar then please create an issue. If you want to become part of the team then please contact [me](https://github.com/Vencint) and we will have a short Discord call before you join the team.

