# ev-facility-location-implementation
Implementation of the Facility Location algorithm mapped to the EV senior design

## How to use pip and virtualenv
Python has two main flavors in use - python2 and python3. Mac people will probably have python2 preinstalled (though I'm not entirely sure what kind of python it is), and Windows people got nothing. You can install from [the Python site](https://www.python.org/). Linux people can just run `sudo apt install python3` to get python3, and python2 comes with most respectable distributions. Mac people can use [Homebrew](https://brew.sh/) and Windows people can use [Chocolatey](https://chocolatey.org/), but unless you already have these things, it's probably not worth it just for this. You'll want pip2 and python2 for what we're doing. We might switch to python3 and pip3 later, not sure how that'll go.

Python is a modern scripting language, and like any self-respecting modern language these days, it comes with a package manager. That package manager is called pip. Its job is to download and set up packages that you use in your python projects. There's a pip2 (that pulls python2 packages) and a pip3 (that pulls python3 ones). You can check which one you have on default by running `pip -v` It has a few.... idiosyncracies, however. Namely that it installs packages globally by default and then yells at you for installing packages globally (usually with permissions errors).

Virtualenv is a Python tool that allows you to make a mini-sandbox to download and install packages in. That way pip will install locally (no warnings or errors!), and you can keep a list of dependencies for a given project with version numbers. Even if the package updates, the version that is downloaded will be the one specified in a text file, so the project will be guaranteed to be portable.

To install, run `sudo pip install virtualenv`. (I know I said that it doesn't like you installing packages like this, but this is an exception.) Linux people can install through apt.

Then we can use `virtualenv <projectname>` to create a virtual environment. To use a non-default python, you can do `virtualenv -p <pythonexecutable> <projectname>`. It'll look something like this to create a new project and activate it:

```bash
virtualenv -p python3 test
cd test
source ./bin/activate # For you poor Windows command prompt souls, leave off the word source
```
Now you'll see the project name in parentheses is to the left of your prompt. This means that when you type `python` or `pip`, you're referring to the virtualenv versions. Now we can do something like `pip install cvxopt` and it'll install it in the `lib` folder with some crazy directory structure that is managed for you. All it did was install it, though. You'll probably want to add the thing you installed to the list of dependencies, which is traditionally kept in a file called `requirements.txt`. To update that file, run

```bash
pip freeze > requirements.txt
```

Pip checks what's downloaded, then prints package names and version numbers. We don't want just the list - we want to save it - so we redirect the output to the file.

Now let's say that someone did this setup for you and hands you a project - what do you do to download the dependencies?

```bash
source ./bin/activate # Assuming you haven't enabled the project yet
pip install -r requirements.txt
```

This tells pip to go download all the dependencies in the requirements.txt file with the specified version numbers.

To stop using a give project, type deactivate. This returns your terminal to normal.

That's most of the setup you need to know - make sure to try it out though. If stuff breaks, or if you have any questions, let me know.

NOTE: While setting up this repo, I learned that you're not actually supposed to put the bin folder in your version control. Who knew. So you can just initialize your own virtualenv projects I guess. Just cd into the folder and use project name `.` to create one in the folder you're in.

Specifically, this project uses python2, so make sure you use it to set up as well.

