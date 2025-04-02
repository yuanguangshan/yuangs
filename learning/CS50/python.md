[MUSIC PLAYING] DAVID J. MALAN: All right, this is CS50. And this is week 6, wherein we transition away from that programming language called C to another programming language called Python. And, whereas a language like C, as you've probably come to appreciate, for better or for worse, is very low level-- like, if you want the computer to do something, you have to do most everything yourself, including asking for memory, giving memory back. 
音乐播放] 大卫·J·马尔兰：好的，这是 CS50。现在是第 6 周，我们将从 C 语言这种编程语言过渡到另一种编程语言 Python。而像 C 这样的语言，你可能已经欣赏到，无论是好是坏，都是非常底层的——比如，如果你想让计算机做某事，你必须做几乎所有的事情，包括请求内存，释放内存。

Python is actually representative of a type of programming language that's generally referred to as a higher-level language, which does a lot of that lower-level stuff for you. In other words, you don't have to manage your own memory. You can iterate over things much more quickly than using a traditional for loop as in C. And so, in short, a language like Python is just easier and more pleasant, daresay, more fun to use. 
Python 实际上代表了一种通常被称为高级语言的编程语言类型，它为你做了很多底层的工作。换句话说，你不需要管理自己的内存。你可以比使用 C 语言中的传统 for 循环更快地迭代事物。简而言之，像 Python 这样的语言使用起来更简单、更愉快，甚至可以说更有趣。

Moreover, it has even more of an ecosystem of libraries, libraries being code that other people wrote that you can use. And, as we'll see today, it's so much easier to get real work done and really focus on the problems that are of interest to you. What today is also going to be about is teaching yourself a new language. 
此外，它还有更多的生态系统，这些生态系统是其他人编写的代码，你可以使用。正如我们今天将看到的，它使完成实际工作并真正专注于你感兴趣的问题变得容易得多。今天还将涉及的是自学一门新语言。

And, indeed, the way we're going to approach this lecture and the coming weeks problem set and beyond is to give you all of the right tools and techniques via which to learn a new language in the confines of CS50 initially but, after this course, on your own because even if you don't go off and major in computer science, odds are you'll have some occasion for programming in the future, be it for academically, professionally, or for fun. And so odds are a lot of the languages we're talking about today are not going to be nearly as useful in a few years and few years out. But the fundamentals, the ideas underlying them will be the same. And so the goal today is to pick up new ideas and syntax along the way. 
事实上，我们将如何处理这次讲座以及接下来的几周问题集以及更远的事情，就是给你们提供所有正确的工具和技术，以便在 CS50 的框架内学习一门新语言，但在这门课程之后，你们将能够独立学习，因为即使你们没有选择计算机科学作为主修，未来也很有可能需要编程，无论是学术上、职业上还是为了乐趣。所以，我们今天讨论的许多语言在几年后可能不会那么有用，但几年后，它们的基本原理和思想将是一样的。因此，今天的目的是在过程中积累新的思想和语法。

So recall that where we began was this in week 0, like hello, world. Everything was so cute and easy to do. It sort of escalated quickly when we got to see where all of a sudden hello, world became a little something like this. 
所以，回想一下，我们在第 0 周开始的地方，就像“你好，世界”。一切看起来都很可爱，很容易做。当我们突然看到“你好，世界”变成了这样的时候，情况很快就升级了。

But, to my point about Python being higher level and just doing more work for you, today, in Python, if you want to implement hello, world, it's going to be reduced to a single one line. And we'll see this in all sorts of contexts. The catch, though, is that if you want to run Python programs, that process today is going to change a little bit. 
但是，关于 Python 更高级并且为你做更多工作的观点，今天在 Python 中，如果你想实现“Hello, World”，它将被简化为单行。我们将在各种环境中看到这一点。不过，如果你想要运行 Python 程序，这个过程今天会有一些变化。

Recall that, in C, we've had this technique for a while now where you have to make your program, and then you can run it with ./whatever the name of the program is. Technically, we reveal that that's short for a longer form command where Clang is the actual compiler. But, today, the command is going to be simpler and fewer in quantity and that this is the command, henceforth, via which we'll run a program in a language like Python. 
回想一下，在 C 语言中，我们已经有了这种技术一段时间了，你需要先编写程序，然后可以使用./程序名来运行它。技术上，我们揭示这实际上是更长的命令的简称，其中 Clang 是实际的编译器。但今天，命令将会更简单，数量更少，这就是我们将通过它来运行像 Python 这样的语言的命令。

And, in particular, there's a few things that have changed here. Obviously the file extension is different. Instead of c, it's going to be .py or py for Python. But, notice too, it's only one step instead of two. And that's because, as we'll see, Python is generally described as an interpreted language where a C is generally described as a compiled language. 
特别是，这里有一些变化。显然，文件扩展名不同，不再是.c，而是.py 或.py。注意，它只需要一步而不是两步。这是因为，正如我们将看到的，Python 通常被描述为解释型语言，而 C 语言通常被描述为编译型语言。

And that's not a characteristic. That's intrinsic to the language just by convention. Most everyone in the world, when writing C code, compiles it thereafter from source code to machine code, the 0's and 1's that your computer, your CPU ultimately understands. But Python and other languages like it are a little more user-friendly in that you don't need to write your code, compile your code, run your code, change your code, compile your code, run your code. 
这并不是一个特性。这是由语言约定而来的内在属性。世界上大多数人在编写 C 代码时，都会从源代码编译成机器码，即你的电脑、你的 CPU 最终能理解的 0 和 1。但 Python 和其他类似的语言则更加用户友好，因为你不需要编写代码、编译代码、运行代码、修改代码、再次编译代码、再次运行代码。

You can actually skip the compilation step and just use a program that coincidentally is called Python itself. But, whereas Clang, for instance, was a compiler that converted source code to machine code, Python, in this case, is an interpreter, which, for now, you can think of as just running your code top to bottom, left to right, and looking at each line of code and figuring out what to do with it without actually compiling it to 0's and 1's first. So it's a little more user-friendly, half as many steps. And so that too is a good thing. 
实际上，你可以跳过编译步骤，直接使用一个巧合地被称为 Python 的程序。但是，例如 Clang 这样的编译器是将源代码转换为机器码的，而 Python 在这个例子中是一个解释器，你可以将其视为只是从上到下、从左到右运行你的代码，查看每一行代码并确定如何处理它，而不需要先将其编译成 0 和 1。因此，它更加用户友好，步骤减少了一半。这也是一件好事。

Well, let's actually see this in context for a moment in VS Code. Let me go over to the very first program we wrote in C, which was this one here in a file called hello.c, or, in this case, hello0.c. And what I want to do here is create a new program that's the distillation of this in Python. So let me do code of hello.py, in this case. 
好吧，让我们先在 VS Code 中看看这个上下文。让我转到我们写的第一个 C 语言程序，就在这个名为 hello.c 的文件里，或者在这个情况下，hello0.c。我想在这里创建一个新的程序，它是这个程序的 Python 版本的提炼。所以让我写一下 hello.py，在这个情况下。

Notice, that it's opened a second tab as always. But what I'm going to do a bit of today is open two files side by side just so we can see exactly what's going on. So if I drag this tab over here, you'll see that it'll split the screen in this nice, convenient way. So now I have two files open. 
注意，它像往常一样打开了一个新的标签页。但今天我要做的其中一件事情是并排打开两个文件，这样我们就可以清楚地看到发生了什么。所以如果我把这个标签页拖到这里，你会看到它会以这种方式方便地分割屏幕。现在我有两个文件打开了。

But, in this file, I'm just going to do print, quote, unquote, "Hello comma world", and that's it. Well, what am I next going to do? Well, in order to run this code at right, I don't need to compile it. I just need to interpret it by running a program called Python on a file called hello.py, crossing my fingers, as always. And, voila, now I have written my first program in Python, so kind of neat. 
但是，在这个文件里，我只输入 print "Hello, world"，就结束了。接下来我该做什么呢？为了正确运行这段代码，我不需要编译它。我只需要通过运行一个名为 Python 的程序来解释这个名为 hello.py 的文件，就像往常一样，抱着侥幸心理。哇，现在我写出了我的第一个 Python 程序，所以这很酷。

And, so far at least, it's now one line of code instead of six. There's no curly braces. There's no includes. There's no int, main, and void. 
至少到目前为止，现在只有一行代码，而不是六行。没有花括号。没有 includes。没有 int main 和 void。

There's just a lot of less-- there's a lot less clutter in there. But the idea's ultimately the same. But what's exciting about Python and just to motivate why we're introducing a higher-level language here on out, you can just get a lot more interesting work done quickly too. 
就是有很多更少的东西——里面的杂乱更少了。但最终的想法还是一样的。但关于 Python 最令人兴奋的是，我们可以更快地完成更多有趣的工作。

So, for instance, let me go ahead and do this. Let me go ahead and open up in my own pset5 directory files that I brought in advance, which was a solution to problem set 5's spell checker whereby recall that you made a program called speller, but that compiled a file along with it called dictionary.c, which you had to implement the functions within. So if I go ahead and run this program, recall, on maybe one of the bigger files, like the Sherlock Holmes text and hit Enter, that's going to churn through all of the seeming misspellings therein and tell me that time in total took 1.17 seconds to spell check that whole file. 
例如，让我先打开我事先准备好的 pset5 目录下的文件，这是一个针对问题集 5 的拼写检查器的解决方案。记得你创建了一个名为 speller 的程序，但它还编译了一个名为 dictionary.c 的文件，你需要在其中实现函数。所以，如果我运行这个程序，记得，在可能的一个较大的文件，比如福尔摩斯文本上按 Enter 键，它将处理其中的所有疑似错别字，并告诉我整个文件拼写检查总共花费了 1.17 秒。

Well, that's pretty darn fast. But consider how many hours, days, week it took to actually implement that spell checker, the contents of dictionary. Let me propose that what I'm going to do here is open up a new file called dictionary.py. And I'm going to propose to implement four functions, but in Python instead of in C. 
嗯，这确实非常快。但想想看，实现这个拼写检查器和字典内容需要多少小时、多少天、多少周。让我提出一个想法，我将在这里创建一个新的文件，叫做 dictionary.py。我建议在这里实现四个函数，但使用 Python 而不是 C。

And those functions are going to be check, load, size, and unload, and let's see how quickly I can churn out problem set 5 using a language like Python instead of C. I'm going to go ahead and open a file called dictionary.py. And, in the first line of code, I'm going to give myself a variable called words. 
这些函数将是 check、load、size 和 unload，让我们看看我能否快速完成问题集 5，使用 Python 这样的语言而不是 C。我将打开一个名为 dictionary.py 的文件。在代码的第一行，我将给自己一个变量叫做 words。

And I'm going to set that equal to a function called set, which, just like in math, gives me a container for a set of values, so no duplicates, for instance. You can think of it sort of like an array, sort of like a list, but less well defined in this case. It's just going to be a set of words. 
我将把这个变量设置为 set 函数，就像在数学中一样，它给我一个值的容器，没有重复，例如。你可以把它想象成一种类似于数组的列表，但在这个情况下定义不那么明确。它将只是一个单词的集合。

Now, I'm going to go ahead and define a function in Python called check. Just like in C, it's going to take one word as input. And the way I'm going to implement this check function in Python is quite simply is this. return word.lower in words. All right, that's it for the check function in Python. 
现在，我将定义一个名为 check 的 Python 函数。就像在 C 语言中一样，它将接受一个单词作为输入。我在 Python 中实现这个 check 函数的方式非常简单，如下所示。返回 word.lower in words。好吧，这就是 Python 中 check 函数的全部内容。

Now, I'm going to go ahead and define another function called load, which, just like in C, takes a dictionary as input. And then I'm going to implement that as follows. With open dictionary as file colon. And then, below that, words.update file.read .splitlines, and that's it for that. 
现在，我将定义另一个名为 load 的函数，就像在 C 语言中一样，它接受一个字典作为输入。然后我将这样实现它。使用 with open dictionary as file colon。然后，在下面，words.update file.read .splitlines，这就是 load 函数的全部内容。

And then I'm going to go ahead and return true, capital T. Below that, I'm going to define a size function whose purpose in life is just like in C, to return the size of this here dictionary. So I'm going to return the length of that words variable that I created on my first line. 
然后我将返回 true，大写的 T。下面，我将定义一个名为 size 的函数，其存在的目的就像在 C 语言中一样，就是返回这个字典的大小。所以，我将返回我第一行创建的 words 变量的长度。

And then down here I'm going to define, lastly, a function called unload. But, as I mentioned earlier, because Python manages your memory for you, you don't need to go and free anything like that. So, you know what, I'm just going to say return true, and I'm done. 
然后在这里，我将定义最后一个名为 unload 的函数。但是，正如我之前提到的，因为 Python 为你管理内存，你不需要去释放任何东西。所以，你知道的，我只需要说返回 true，我就完成了。

This then is problem set 5 written in Python. So a bit of a flex, to be fair, because I had the cheat sheet in front of me with all the answers. And it might've taken me, though, a few minutes to actually implement this instead of indeed a few hours or, again, a few days. 
这就是用 Python 编写的第五个问题集。公平地说，因为我面前有所有答案的备忘单，所以有点灵活。不过，实际上实现这个可能只花了我几分钟，而不是确实的几个小时或几天。

And what's in here should not necessarily be obvious. These are some somewhat cryptic lines of code vis-a-vis what we've been doing in C. But, by the end of today, by the end of this week, by the end of the course, after which you've seen more Python, you'll be able to read and understand what's going on here. And, in fact, the way I myself wrote this code some time ago was I opened up in one file dictionary.c, and then I opened up another file, dictionary.py, and I essentially translated the left to the right by googling, as needed, the syntax in Python or looking back at my own notes. But that, too, is going to be how we, today and this coming week, introduce you to this new language by showing you how it is similar to and sometimes different from a language you already know. 
这里包含的内容并不一定显而易见。这些代码行相对于我们在 C 语言中做的东西来说有些晦涩。但是，到今天、这周、这门课程结束时，在你看到更多的 Python 之后，你将能够阅读和理解这里发生的事情。实际上，我多年前编写这段代码的方式是，我打开了一个名为 dictionary.c 的文件，然后又打开了一个名为 dictionary.py 的文件，我基本上是通过谷歌搜索所需的 Python 语法或查阅自己的笔记，将左边的代码翻译到右边。但今天和接下来的这周，我们将通过展示它与你已经了解的语言的相似之处和不同之处来介绍这种新语言。

And so the hard part is done. Now that you know a fairly low level and challenging language like C, even though it's been just a few weeks, you can really bootstrap yourself to knowing and understanding new languages, present and future, by just recognizing similarities and patterns. And, along the way, there's undoubtedly going to be new features that you encounter in Python, in future languages. But no big deal, you're just going to be filling in some gaps in your knowledge at that point, instead of starting from scratch. I guess, pun intended. 
现在艰难的部分已经完成。既然你已经掌握了像 C 这样的相当低级且具有挑战性的语言，尽管只是几周前的事情，你就可以通过识别相似性和模式，真正地自学并理解新旧语言。而且，在这个过程中，你无疑会遇到 Python 和未来语言中的新特性。但这不是什么大问题，你只是在填补知识上的空白，而不是从头开始。我想，这应该是个双关语。

Well, let's do one other sort of revelation here. Recall that in problem set 4, you had to implement a few filters like that of blurring. And maybe you were feeling more comfortable, and you did a bit of edge detection. 
好吧，让我们再揭示一点。回想一下，在问题集 4 中，你必须实现一些过滤器，比如模糊。也许你感觉更自在，做了一些边缘检测。

Let me propose that I could do exactly that in some Python code too. So let me go ahead and open up a new file, for instance, called blur.py. Let me go ahead and use a library that comes with Python that we've already installed. It's called the Python image library, so from PIL import Image comma ImageFilter. 
让我提出，我也可以用一些 Python 代码做到这一点。所以，让我打开一个新文件，比如叫做 blur.py。让我使用 Python 自带的一个库，我们已经安装过了。它叫做 Python 图像库，所以从 PIL 导入 Image 和 ImageFilter。

Then, on my next line, I'm going to create a variable called before. I'm going to set that equal to the return value of a function called Image.open. And I'm going to open a file that you've seen before, bridge.bmp. 
然后，在我的下一行代码中，我将创建一个名为 before 的变量。我将将其设置为名为 Image.open 的函数的返回值。我将打开一个你之前见过的文件，bridge.bmp。

My next line of code, I'm going to create a variable called after to represent after the filtration of this image and set that equal to the before variable .filter, passing in as an argument ImageFilter.BoxBlur open parenthesis 1 close paren. And then, lastly, I'm going to do after.save. And I'm going to save this file as out.bmp. 
接下来的一行代码，我将创建一个名为 after 的变量来表示图像过滤后的结果，并将其设置为 before 变量.filter，传入参数 ImageFilter.BoxBlur(1)。然后，最后，我将执行 after.save。我将把这个文件保存为 out.bmp。

Now, of course, I'm relying on the fact that there is a file called bridge.bmp. So I'm going to grab a copy of that from problem set 4, and that file is going to be a nice, pretty picture of the Weeks Bridge down by the river. And, in fact, if I open that up with code of bridge.bmp, this here is the original version of that there bridge. 
当然，我依赖于存在一个名为 bridge.bmp 的文件。所以我会从问题集 4 中获取这个文件的副本，这个文件将是一张非常漂亮的河流附近的 Weeks 桥的图片。实际上，如果我用 bridge.bmp 的代码打开它，这里就是那座桥的原始版本。

So let's run my four lines of blur.py code on this. And, just to make it a little more obvious on the screen here, instead of just looking at one pixel around every pixel to blur things, I'm going to be a little dramatic and use 10 pixels just to make it even blurrier as to appear nicely on the screen. I'm going to go ahead and run Python of blur.py. And, when I hit Enter, those four lines of code will be interpreted, so to speak, top to bottom, left to right. 
那么，让我们在这上面运行我的 blur.py 代码的四个行。为了在屏幕上更明显，我将会稍微夸张一点，使用 10 个像素来使模糊效果更加明显，以便在屏幕上看起来更佳。我将运行 Python 的 blur.py。当我按下 Enter 键时，这四个代码行将会从上到下、从左到右被解释。

Nothing seems to happen. But if I type ls now, I should see, indeed, a file called out.bmp as well. Let me go ahead and open that, out.bmp. And, whereas the before version was this, the after version is now this in just four lines of code. 
看起来没有发生任何事。但是，如果我现在输入 ls，我应该能看到，确实有一个名为 out.bmp 的文件。让我打开那个，out.bmp。而之前的版本是这样的，现在的版本现在是这样的，只用了四行代码。

And, for those of you who were indeed feeling more comfortable with that same problem set, let me propose to implement the edge-detection algorithm that you might recall. And let me create a different file for that, so code of edge.py. And, inside of edge.py, I'm going to go ahead and do the same thing as before from the Python image library. 
对于那些确实对相同的问题集感到更舒适的人，我建议实现你可能记得的边缘检测算法。我将为这个创建一个不同的文件，所以是 edge.py 的代码。在 edge.py 中，我将像之前一样使用 Python 图像库。

Import an image feature and an image filter feature. Then give myself a variable again before equals Image.open, quote unquote, bridge.bmp. Then a variable called after as before equals before.filter, passing in this time ImageFilter.FIND_EDGES, which is a feature that just comes with this library. And then I'm going to go ahead and do after.save and, again, out.bmp. 
导入图像特征和图像滤波器功能。然后给自己一个变量，再次使用等于 Image.open，引号中的 bridge.bmp。然后一个名为 after 的变量，与之前相同，等于 before.filter，这次传入 ImageFilter.FIND_EDGES，这是这个库自带的功能。然后我将继续进行 after.save，再次，输出为 out.bmp。

I'm going to very quickly then run Python, the name of the interpreter on edge.py, which is going to use as input bridge.bmp again, which is the original version. But if I now open up out.bmp and hit Enter, instead of looking like this, now, after four lines of Python, it looks like this. So if you've been feeling a little frustrated by just how much time, how much energy, how many lines of code it takes to solve problems that ultimately may very well be interesting visually or otherwise, it's now going to get a lot easier to do some of those same features. But, of course, we'll give you the capability to do some more things as well. 
我将很快运行 Python，解释器的名称为 edge.py，它将使用 bridge.bmp 作为输入，这是原始版本。但现在如果我打开 out.bmp 并按 Enter 键，而不是现在看起来这样，经过四行 Python 代码后，它看起来像这样。所以如果你觉得解决那些最终可能非常有视觉或其他方面兴趣的问题需要花费太多时间、精力和代码行数，现在将变得容易得多。当然，我们也会给你提供做更多事情的能力。

But, before we do that, let's actually take a tour of what some of the features are that we're going to get now with a language called Python, sort of evoking memories of week 1 when we transitioned from Scratch to C. So, in the world of Python, there's absolutely functions. You just saw a whole bunch of them. And, again, the syntax looks new and different and perhaps a little weird versus C. But, over the course of today and this week, everything I just typed will become more familiar. 
但是，在我们这么做之前，让我们先来了解一下我们现在将使用一种叫做 Python 的语言获得的一些功能，这让人想起了第一周我们从 Scratch 过渡到 C 语言时的情景。在 Python 的世界里，绝对有函数。你们刚刚看到了一大堆。而且，再次强调，与 C 语言相比，Python 的语法看起来既新又不同，也许有点奇怪。但是，在今天的课程和本周的课程中，我刚才输入的所有内容都将变得更加熟悉。

Here is going to be a side-by-side comparison now of Scratch, just like from week 0, to this week in Python. But we'll compare it along the way to some C code as well. So this was, of course, the simplest function we used back in Scratch to just say hello, world on the screen. 
现在将进行 Scratch（就像第 0 周那样）和本周 Python 的对比。但我们会沿途将其与一些 C 代码进行比较。当然，这是我们之前在 Scratch 中使用的最简单的函数，只是要在屏幕上显示“hello, world”。

In C, it looked a little something like this, but I've claimed already today, in Python, it's going to instead look like this. And, just as a little bit of a comparison, what's different? Let's see, yeah. 
在 C 语言中，它看起来可能有点像这样，但我在今天已经说过，在 Python 中，它将看起来像这样。作为比较，有什么不同呢？让我们看看，是的。

So there's no semicolon. Amazingly, Python largely gets rid of the semicolon. So, when your thought is done, that's it. 
所以，Python 几乎去掉了分号。令人惊讶的是，Python 在很大程度上去掉了分号。所以，当你的想法完成时，那就结束了。

Python will figure out that it's done. You don't need to terminate your thought with a semicolon. What else is different here? Yeah. 
Python 会明白它已经完成了。你不需要用分号结束你的想法。这里还有什么不同吗？是的。

AUDIENCE: Backslash n.   观众：换行符。

DAVID J. MALAN: Yeah, so backslash n is missing, which, in C, we needed to tell the computer to add a new line, so to speak. Move the cursor to the next line. 
大卫·J·马尔安：是的，所以这里缺少了换行符，在 C 语言中，我们需要告诉计算机添加一个新行，换句话说。移动光标到下一行。

Turns out that, after years of experience, humans decided that, gosh, we are so often using backslash n in our print statements, let's just make it the default instead of vice versa. That does invite the question, well, how do you undo that? But we'll come back to that before long. But, indeed, you don't need the backslash n. 
经过多年的经验，人类决定，哎呀，我们经常在我们的打印语句中使用换行符，让我们把它作为默认值而不是相反。这确实引发了一个问题，嗯，如何撤销这个操作？但我们很快就会回到这个问题。但，的确，你不需要换行符。

The third and final difference, perhaps obvious now, is that it's print instead of printf. That doesn't mean you can't format strings, but the word print is just so much easier to remember. It's a little less arcane. So the Python community decided, in their language, to call this print instead. 
第三和最后一个区别，现在可能已经很明显了，那就是使用 print 而不是 printf。这并不意味着你不能格式化字符串，但“print”这个词更容易记住。它稍微简单一些。所以 Python 社区决定，在他们自己的语言中，叫它 print。

And what you're seeing already is the slightest hints of the reality that, after years pass and different programmers start using languages, they come up with opinions, what they like, what they don't like. They eventually decide we're going to invent our own language that's better than everything before it. And so what you'll see is that a lot of the frustrations, confusions you might have encountered, you're in good company because some of those now will go away. 
你已经看到的是现实的一点点暗示，经过多年，不同的程序员开始使用不同的语言，他们会形成自己的观点，喜欢什么，不喜欢什么。他们最终决定要发明一种比之前所有语言都更好的语言。所以你会发现，你可能遇到的大部分挫折和困惑，你并不孤单，因为其中一些现在将会消失。

The catch is, of course, sometimes people will disagree as to what the right outcome is, the right design. And this is why there's actually hundreds, maybe thousands, of programming languages in the real world. Thankfully, there's probably only a few dozen that are actually very popular and commonly used in practice. 
当然，问题是，有时人们会就正确的结果、正确的设计产生分歧。这也是为什么实际上有数百甚至数千种编程语言在现实世界中存在。幸运的是，可能只有几十种语言在实践中被广泛使用。

All right, so, in the real world too, we, of course, have libraries. And we saw some of those libraries in the world of C, we're also going to see them in the world of Python, even more powerfully so, like the filtration we just did of images being able to very quickly implement a spell checker with the code that I wrote. In the world of Python, just know that libraries are generally called modules and packages. And there's some slight difference between those two, but, for now, module packages are just Python terminology for what we already to be libraries. 
好的，那么，在现实世界中，我们当然也有库。我们在 C 语言的世界中已经看到了一些这些库，我们也会在 Python 的世界中看到它们，甚至更加强大，就像我们刚才对图像进行的过滤，能够非常快速地使用我写的代码实现拼写检查器。在 Python 的世界里，只需知道库通常被称为模块和包。这两者之间有一些细微的差别，但现在，模块包只是对我们已经称为库的东西的 Python 术语。

CS50 has its own library. And, in fact, in C, we use this atop any program that we want to use get_string, get_int, and strings themselves. In Python, they're still going to be a CS50 library, but very brief training wheels that are available, if only to ease the transition from C to Python. 
CS50 有自己的库。实际上，在 C 语言中，我们会在任何我们想要使用的程序中使用它，比如 get_string、get_int 和字符串本身。在 Python 中，它们仍然是 CS50 库，但只是一些简短的辅助工具，仅为了帮助从 C 语言过渡到 Python。

But the syntax for using CS50's library henceforth is going to be more simply import CS50, very similar to what we saw a moment ago with that Python imaging library-- Python image library. There's alternative syntax you might see over time where if you only want to import one or specific things, you don't have to import the whole library. You can import from cs50 a specific function or symbol more generally like this. 
但是今后使用 CS50 库的语法将更加简单，就像我们刚才看到的 Python 图像库——Python 图像库一样，导入 CS50。随着时间的推移，你可能会看到不同的语法，如果你只想导入一个或特定的东西，你不必导入整个库。你可以像这样从 cs50 导入一个特定的函数或符号。

So you'll see two different techniques like that. Well, let's go ahead now and actually build on the program we wrote already by doing something just like we did in week 0 as well as in week 1, where we actually got input from the user. So, in Scratch, here was how we prompted the user. 
所以你会看到两种不同的技术。好吧，现在让我们继续构建我们之前写的程序，就像我们在第 0 周和第 1 周做的那样，我们实际上从用户那里获取输入。在 Scratch 中，我们是这样提示用户的。

What's your name? We got back a so-called return value. And then we joined hello comma space with that there return value. 
你叫什么名字？我们得到了一个所谓的返回值。然后我们将 hello, space 与那个返回值连接起来。

In C, this didn't translate nearly as cleanly. We had to introduce, of course, not only get_string for the same function. But we also had to introduce, in the context of printf, these placeholders like %s. For better or for worse, what you're about to see is several different ways to solve the same problem in Python, some of which are a little more similar to Scratch, some of which are a little different from scratch as well. 
在 C 语言中，这并没有翻译得那么干净。我们当然不仅引入了 get_string 这个函数，还引入了 printf 上下文中的这些占位符，比如%s。不管好坏，你将要看到的是解决同一问题的几种不同方法，其中一些与 Scratch 有些相似，而另一些则与 Scratch 有所不同。

Don't have to absorb them all from the get-go. But here's how we might do this in Python instead. One, we can declare a variable called answer. We can then set it equal to the return value of get_string, which, for now, is in the CS50 library for Python. 
你不必一开始就全部吸收。但这里是如何用 Python 来做这件事的。首先，我们可以声明一个名为 answer 的变量。然后我们可以将它设置为 get_string 的返回值，目前这个 get_string 函数在 Python 的 CS50 库中。

You don't need it per se in the real world. But, for now, for parity with C, we've given you this get_string function. It, like in C, takes an argument like, quote, unquote, "what's your name?" But no semicolon at the end of this line. 
在现实生活中，你可能并不需要它。但现在，为了与 C 语言保持一致，我们给你提供了这个 get_string 函数。它就像在 C 语言中一样，需要一个像“你的名字是什么？”这样的参数，但这句话的结尾没有分号。

Second line of code, notice that we're again using print in Python, not printf. We're saying, quote, unquote, "hello comma space". And then a little weirdly, we're using what looks like the addition operator to add, so to speak, the answer to that end of that phrase. 
第二行代码，注意我们再次在 Python 中使用 print，而不是 printf。我们说的是“hello, space”。然后有点奇怪地，我们使用看起来像加号操作符来添加，或者说，将 answer 添加到这个短语的末尾。

But those familiar or not, what might the plus really represent here? It's not addition in a mathematical sense. Yeah. 
但那些熟悉或不熟悉的人，这里的加号到底代表什么？这并不是数学意义上的加法。是的。

AUDIENCE: Concatenation. 
观众：连接。

DAVID J. MALAN: So it's what we would call concatenation, to take one string on the left, one string on the right, and join them, that is, concatenate them together, which is why I need not only the comma grammatically here but also a space so that we actually have a string that looks the way we intend. So this is one way then to implement this here program that we already implemented in Scratch as follows. But there's other ways as well. 
大卫·J·马兰：这就是我们所说的连接，取左边的字符串，右边的字符串，将它们连接起来，也就是拼接它们，这就是为什么我不仅需要在这里语法上使用逗号，还需要一个空格，以便我们实际上有一个看起来是我们想要的样子。所以，这是实现这个程序的一种方法，我们已经像在 Scratch 中那样实现了。但还有其他方法。

I can also change this, a little weirdly, to be a comma-separated list of arguments. So, it turns out, unlike in C, in Python, if you pass one, two, three, or more arguments to the print function, by default, they will just all be printed 1, 2, 3, but with a single space in between them. So that's just the way the print function works per its documentation, which we'll see before long. 
我还可以有点奇怪地将其改为参数的逗号分隔列表。结果，与 C 语言不同，在 Python 中，如果你向 print 函数传递一个、两个、三个或更多参数，默认情况下，它们将依次打印出来，1、2、3，但它们之间只有一个空格。这就是 print 函数按照其文档工作的方式，我们很快就会看到。

So here I've gotten rid of that space, and I've just said my first argument is hello comma. And my second argument is answer. And I just leave it to print to effectively concatenate them together on the screen by printing one followed by the other. So that's the second way we might do this in Python. 
所以我已经去掉了那个空格，我说我的第一个参数是 hello 逗号。我的第二个参数是 answer。我只是让它打印出来，实际上是将它们一个接一个地拼接在一起打印到屏幕上。这就是我们在 Python 中可能做的第二种方法。

Here's a weird-looking third that, for better or for worse, is probably the most common way to do things nowadays even though it's more of a visual mouthful. So I'm still using the print function, but there's that f again but in a weird place. It turns out, if you want Python's print function to format a string for you by plugging in one or more values, the way you do that is you tell Python, not next to the print function, but to the left of the string itself that, hey, Python, here comes a format string, aka, an f string. 
这是一个看起来很奇怪的第三种方法，不管好坏，现在可能是最常见的方法。我仍然使用 print 函数，但是那个 f 又出现了，但位置很奇怪。如果你想让 Python 的 print 函数为你格式化字符串，通过插入一个或多个值，你告诉 Python 的方式不是在 print 函数旁边，而是在字符串本身的左边，嘿，Python，这里是一个格式化字符串，也就是 f 字符串。

And then, inside of those quote marks nicely enough, you can actually use literal placeholders, these curly braces, that say put the value of the answer variable there. So it's sort of a new and improved version of printf in C, which, annoyingly, always had us using %s, %i, %f, and so forth. Now, you just put curly braces and the name of the actual thing you want to plug in to that location. This is called variable interpolation whereby the variable's value, answer in this case, will be substituted without the curly braces appearing in the final output. So that's then how we might implement exactly that same feature using this thing called a format string. 
然后，在那些引号里面，足够好地，你实际上可以使用字面量占位符，这些花括号，表示将答案变量的值放在那里。所以这就像是 C 语言中 printf 的一个新改进版本，它总是让我们使用%s、%i、%f 等等。现在，你只需要放上一个花括号和你要插入的实际名称。这被称为变量插值，其中变量的值（在这个例子中是 answer），将替换掉花括号，不会出现在最终的输出中。所以这就是我们如何使用这个叫做格式字符串的东西来实现这个功能。

So how might I go about doing this? Well, let me actually go back to VS Code in just a moment here. And let's go ahead and open up my same file called hello.py. So code of hello.py, let's go ahead and implement this variant thereof. 
那么，我该如何去做这件事呢？好吧，让我稍后回到 VS Code。然后我们打开我同样的文件，叫做 hello.py。让我们先实现这个变体的代码。

So, in hello.py, I previously had just this single line of code-- uh-oh. Yes, what's going wrong? 
所以，在 hello.py 中，我之前只有这一行代码——哎呀。是的，出什么问题了？

IAN: Just a little crimp. 
IAN：只是有点小问题。

DAVID J. MALAN: Oh, it was making noises. Sorry. 
大卫·J·马兰：哦，它在发出噪音。抱歉。

OK. That was Ian. Thank you, Ian. 
好的。那是伊恩。谢谢，伊恩。

[APPLAUSE]   [掌声]

OH, thank you, thank you, Ian. So, here, let me go ahead and open a file called hello1.c, which I brought back from week 1 itself. And let's go ahead and open up hello.py here again. Just so we can see these things side by side, I'm going to drag this one over to top-right so we can see hello.c on the left, albeit somewhat cut off, and hello.py on the right. 
哦，谢谢，谢谢，伊恩。那么，这里，让我先打开一个名为 hello1.c 的文件，这是我从第一周带来的。然后我们再打开 hello.py。这样我们就可以并排看到这些内容了。我将把这个拖到右上角，这样我们就可以看到 hello.c 在左边，尽管有些被截断，hello.py 在右边。

And let's now change hello.py to actually get some user input. So, from CS50's library, I'm going to import a function called get_string. And then, inside of this actual program, I'm going to create a variable called answer. 
现在让我们将 hello.py 改为获取一些用户输入。所以，我从 CS50 的库中导入了一个名为 get_string 的函数。然后，在这个实际程序中，我将创建一个名为 answer 的变量。

I'm going to set it equal to the return value of string. I'm going to pass in a prompt like, what's your name question mark space, and then close quote and close parentheses. And then, lastly, I'm going to use one of those f strings and print out, quote, unquote-- or, rather, f, quote, unquote, "hello comma answer", close quotes. 
我将把它设置为 string 的返回值。我将传递一个提示，比如，你的名字？空格，然后关闭引号和关闭括号。最后，我将使用一个 f 字符串打印出，引号，不引号，或者更确切地说，f 引号，不引号，“hello, answer”，关闭引号。

And it's a little weird now with the f and the quotes and the curly braces and the parentheses, but if you just follow them from inside out, they are all nicely symmetric and balanced. If now, in my prompt, I go back down and run Python of hello.py, Enter. Instead of seeing, of course, hello comma world Immediately, I can type in my name and hit Enter. And now I see exactly that. 
现在 f、引号、花括号和括号看起来有点奇怪，但如果你从内向外遵循它们，它们都是非常对称和平衡的。如果现在，在我的提示中，我回到 hello.py 并运行 Python，输入。当然，你会看到 hello, world。立即，我可以输入我的名字并按 Enter。现在我看到的就是这个名字。

But there's a few things I could do wrong here. For instance, if I forget this here format string and just do, quote, unquote, "curly brace answer" and then I go back and run Python of hello.py, I'm still going to be prompted for my name, like David. But what's going to go wrong now intuitively? What am I going to see? Yeah. 
但是这里有几个错误我可能会犯。例如，如果我忘记这里的格式化字符串，只写上引号，"花括号答案"，然后我回到 hello.py 并运行 Python，我仍然会被提示输入我的名字，比如 David。但现在直观上会出什么问题呢？我会看到什么？是的。

AUDIENCE: You're going to [INAUDIBLE] 
观众：你将要[听不清]

DAVID J. MALAN: Perfect, because I haven't told Python that this is a special formatted string with that little f, it's indeed going to print out hello comma curly brace answer just as we see here. So a subtle bug, but one that's very easily fixed with that there f, but there's something else worth noting here. Let me go back over to highlight this code. 
大卫·J·马尔安：太好了，因为我没有告诉 Python 这是一个特殊的格式化字符串，带有那个小写的 f，它确实会像我们在这里看到的那样打印出"hello, 花括号答案"。这是一个微小的错误，但很容易用那个 f 来修复，但这里还有其他值得注意的地方。让我回到代码中高亮显示这一点。

This varies from C, oh, in another way too. There's indeed no semicolons on lines three or four. But what else is different vis-a-vis the C version here still at left? What's different? How about here? 
这与 C 语言在另一个方面也有所不同。在第三行和第四行上确实没有分号。但与左侧的 C 版本相比，还有什么不同之处？有什么不同？这里呢？

AUDIENCE: There's no main. 
观众：没有主函数。

DAVID J. MALAN: So there's no main. So there's none of this. There's none of this, and there's no curly braces. Yeah, what else? 
大卫·J·马兰：没有主函数。没有这些。没有这些，也没有花括号。还有什么呢？是的。

AUDIENCE: Declare the type. 
观众：声明变量类型。

DAVID J. MALAN: I didn't have to declare the type of the variable. So this too, for better or for worse, is a feature of Python. We'll see that Python has data types. 
大卫·J·马兰：我无需声明变量的类型。所以，无论是好是坏，这也是 Python 的一个特性。我们会看到 Python 有数据类型。

There are strings, there are ints, there are floats, but you don't need to tell the interpreter what your variables are. Rather, Python as an interpreter will just figure it out from context. So if you're assigning a variable called answer to what clearly is going to be a string, the type of that variable answer will be a string. 
有字符串、有整数、有浮点数，但你不需要告诉解释器你的变量是什么类型。相反，Python 作为解释器会根据上下文自行判断。所以如果你将一个名为 answer 的变量赋值为一个明显是字符串的值，那么这个变量 answer 的类型将是字符串。

If, though, you used get_int or something similar, the type of that variable might be an int, instead. So here too, a lot of the things that, why doesn't the computer just figure it out? are baked into Python as features. So if I go back over here after now having implemented this version of hello, we can revisit perhaps something that I glossed over earlier whereby, in Python, the default seems to be to give you a new line at the end of any print statement. 
如果，尽管如此，你使用了 get_int 或类似的函数，那么这个变量的类型可能就是整数。所以这里也有很多为什么计算机不能自己判断的问题被 Python 作为特性内置了。所以如果我回到这里，在现在实现了这个版本的 hello 之后，我们可以回顾一下我之前可能一笔带过的东西，那就是在 Python 中，默认情况下，任何 print 语句的末尾都会有一个换行符。

But that does invite the question, well, how do you actually get those back-- or get rid of that if you indeed do? Well, this gives us a brief opportunity to talk about one piece of jargon in the world of Python and certain other languages, which is that all of these parameters or arguments we've been using for weeks, where you just put a comma-separated list of arguments or values inside of parentheses when calling a function to give those functions input, those have, all this time, been called positional parameters because the order has always mattered. The first thing, the second thing, the third thing influences what the function does with those arguments. 
但是这确实引出了一个问题，嗯，你实际上是如何恢复这些的——或者如果你真的想，你是如何删除它们的？嗯，这给了我们一个简短的机会来谈谈 Python 和某些其他语言世界中的一个术语，那就是我们过去几周一直在使用的所有这些参数或参数，你只需在调用函数时在括号内放入逗号分隔的参数或值列表，以向这些函数提供输入，这些一直被称为位置参数，因为顺序始终很重要。第一件事，第二件事，第三件事影响着函数如何处理这些参数。

But, in Python and certain other languages, there's also what we're going to call named parameters whereby you can actually specify not just a generic comma-separated list of values for which the order matters. You can instead provide the name of a variable and its value, the name of a variable and its value, specifically, the name of a parameter and its value as a comma-separated list, the upside of which is that it's a little clearer to you, the reader, you the programmer, what does what? And it's also not nearly as vulnerable to you just screwing up the order and getting them slightly out of order and constantly having to check the documentation as to what goes in what order. 
但是，在 Python 和某些其他语言中，我们还可以称之为命名参数，这样您不仅可以指定一个通用的、按顺序分隔的值列表，还可以提供变量名及其值，具体来说，是参数名及其值的逗号分隔列表。这样做的好处是，对于您，读者，以及您作为程序员来说，更清楚地知道每个参数的作用。而且，它也不太容易出错，不会因为顺序稍微错乱而需要不断查阅文档以了解参数的顺序。

If you recall using fread or fwrite, for instance, which takes a few arguments, I mean, those two are particularly annoying. And even I always forget which comes first. If I could just use the names of those parameters, it might've eliminated some ambiguity. So how can we use in Python named parameters. Well, let's just do a relatively simple example that's actually pretty commonly leveraged, which is this. 
如果您还记得使用 fread 或 fwrite 等函数，它们需要几个参数，我指的是这两个函数特别令人烦恼。即使我总是忘记它们的顺序。如果我能使用这些参数的名称，可能会消除一些歧义。那么我们如何在 Python 中使用命名参数呢？让我们用一个相对简单且常用的例子来说明这一点。

If I, for whatever reason-- let me get rid of my C version now. And, in fact, let me simplify this and just go back to printing out in hello.py, hello comma world. This, as before, will print out hello comma world with a new line. 
如果出于任何原因——让我现在去掉我的 C 版本。实际上，让我简化一下，只回到在 hello.py 中打印 hello 逗号 world。这，就像之前一样，将打印出 hello 逗号 world 并换行。

If I want to get rid of this, though, I can do that by consulting the documentation for Python. And, in fact, the official documentation for Python lives at this URL, docs.python.org. The upside of this documentation existing is that, unlike C, which doesn't really have an official place to go for documentation other than the manual pages that we, recall, at manual.cs50.io have given you student-friendly versions thereof. Everyone in the world goes to this URL when looking up things for Python officially in its own documentation. 
如果我想摆脱这个，我可以通过查阅 Python 的文档来实现。实际上，Python 的官方文档位于这个网址，docs.python.org。这个文档存在的优点是，与 C 语言不同，C 语言没有官方的文档位置，除了我们回忆中的手动页面，我们在 manual.cs50.io 提供了学生友好的版本。全世界的人在查找 Python 官方文档时都会访问这个网址。

For instance, at this particular URL, there is a list of all of the functions that come built into Python itself. And if we poke around further there, there's one indeed called print, which is really the only one I've been using thus far that comes with the language. And in that documentation, you'll see a somewhat cryptic line like this. 
例如，在这个特定的 URL 上，有一个包含 Python 本身所有内置函数的列表。如果我们进一步探索，确实有一个名为 print 的函数，这是我迄今为止唯一使用过的语言内置函数。在那份文档中，你会看到这样一条有些神秘的语句。

This is the so-called signature or prototype for the print function. The syntax for this is a little different from what we saw in C, but what I see here in the documentation, if you go to that same URL, is that there's a function called print that takes potentially one, two, three, four, five or more arguments, five more arguments or parameters. But what are they? 
这就是所谓的 print 函数的签名或原型。其语法与我们之前在 C 语言中看到的不同，但我在文档中看到的是，如果你访问同一个 URL，有一个名为 print 的函数，它可能接受一个、两个、三个、四个、五个或更多的参数。但它们是什么呢？

Well, over here is some new syntax. And, trust me, this does not mean pointers. There's a * but nothing to do with memory or * or memory or pointers. This just means that there's going to be 0 or more objects that can come as a comma-separated list. 
好吧，这里有一些新的语法。请相信我，这并不意味着指针。这里有一个星号，但与内存或指针无关。这仅仅意味着可能会有 0 个或多个对象，以逗号分隔的列表形式出现。

And we've used that feature already when I printed hello plus name. When I printed hello comma name, I got back one-- I passed in one or two arguments. This just means you can pass in 0 or more just by their position. 
我们已经使用过这个特性了，当我打印 hello plus name 时。当我打印 hello, name 时，我得到了一个——我传递了一个或两个参数。这意味着你可以通过位置传递 0 个或多个参数。

The rest of these are so-called named parameters whereby the print function comes with one named parameter called sep for separator, whose default value is a single space per the, quote, unquote. The print function also comes with an end named parameter whose default value-- and here is going to be the answer to that question earlier-- is backslash n. So this is why every line ending, from the print function, has a backslash n automatically given. 
这些被称为命名参数，其中 print 函数带有一个名为 sep 的命名参数，用作分隔符，其默认值是一个空格，正如引号中所说的。print 函数还带有一个名为 end 的命名参数，其默认值——也就是之前问题的答案——是回车换行符。这就是为什么 print 函数输出的每一行末尾都会自动加上回车换行符。

There's something called file. There's something called flush. More on those perhaps another time. But this is why I automatically got a free space when I passed in two arguments. 
有一个叫做 file 的东西，还有一个叫做 flush 的东西。关于这些可能留到下次再讲。但这就是为什么我自动得到了两个参数之间的空格。

This is why I keep seeing my cursor moved to the next line. But the fact that these things have names sep and end means I can use these named parameters if I so choose to override their default arguments. So, for instance, if I want to override the separator, I can use, quote, unquote, "something else" in between words. If I want to override the new line, I can change the backslash n to something else as well. 
这就是为什么我总是看到我的光标移动到下一行。但 sep 和 end 这些名称意味着我可以选择使用这些命名参数来覆盖它们的默认参数。例如，如果我想覆盖分隔符，我可以在单词之间使用“其他东西”这样的引号。如果我想覆盖换行符，我也可以将回车换行符改为其他字符。

So if I go back to VS Code here and, for whatever reason, I do want to get rid of that new line ending, I can pass a second argument into print, specify that the name of this parameter is E-N-D, end, and set it equal to not backslash n, but really anything I want. So, just to be dramatic, let's use an exclamation point to excitedly say hello, world. And if I now rerun this program as such, now I see hello, world! But then my prompt is immediately on the same line. 
所以如果我要回到 VS Code 这里，出于某种原因，我确实想删除那个换行符，我可以在 print 中传递第二个参数，指定这个参数的名称是 E-N-D，end，并将其设置为不是反斜杠 n，而是任何我想要的。所以，为了戏剧化，让我们用一个感叹号来兴奋地问候“世界”。现在，如果我现在以这种方式重新运行这个程序，现在我看到了“hello, world!”，但是然后我的提示符立即在同一行。

I can get rid of that too if I really want. I can do backslash n after the exclamation point and rerun this again. And now we're back to the usual. But I do get that exclamation point now for free as default functionality. 
如果我真的想这么做，我可以在感叹号后面加上反斜杠 n，再次运行这个程序。现在我们又回到了常规状态。但是，我现在可以免费获得那个感叹号作为默认功能。

So it's a little weird because I'm mixing sort of apples and oranges, so to speak, whereby this is positional and this is named, but, so long as you put your positional arguments first and any things that have explicit names after those, Python can distinguish one from the other. Questions then on any of this just yet? Questions? Yeah. 
这有点奇怪，因为我似乎是在混合苹果和橘子，也就是说，这个是位置参数，而这个是命名参数，但是只要你的位置参数先于任何具有显式名称的参数，Python 就可以区分它们。关于这些内容有任何问题吗？有问题吗？是的。

AUDIENCE: Can you change the type of the variable [INAUDIBLE]? 
观众：你能改变变量的类型吗？

DAVID J. MALAN: Oh, really good question. Can you change the type of a variable once it's there? Can you change, for instance, a string to an integer or maybe vice versa? Short answer, yes. And we're going to trip over that with an example in just a bit. 
大卫·J·马兰：哦，这是一个非常好的问题。一旦变量存在，你能改变它的类型吗？比如，能否将字符串改为整数，或者反过来？简短的回答是，可以。我们很快就会通过一个例子来展示这一点。

And let me call out one other thing that's worth noting here. In the documentation for Python and even in your own code, it turns out that you can use single quotes in ways we have not thus far. Recall that in C double quotes meant it was a string, so typically a phrase, a sentence, a paragraph, whatever. But single quotes in C represented what? 
让我指出另一个值得注意的点。在 Python 的文档中，甚至在你自己的代码中，你会发现你可以以我们之前没有提到的方式使用单引号。回想一下，在 C 语言中，双引号代表字符串，通常是短语、句子、段落等。那么，C 语言中的单引号代表什么呢？

So a single character. That is the definition. In Python, this seems to suggest single characters too, but I clearly just did an exclamation point and then backslash n, so two characters. And that's in fact allowed. In Python, there's no difference between single quotes and double quotes. 
因此，单引号代表一个字符。这就是定义。在 Python 中，这似乎也暗示了单引号代表单个字符，但显然我刚刚使用了一个感叹号然后是反斜杠 n，所以是两个字符。实际上，这是允许的。在 Python 中，单引号和双引号之间没有区别。

Stylistically, in CS50 and style50, we'll actually nudge you toward using double quotes just for parity with C, but it is perfectly reasonable to use single quotes instead in Python, but, stylistically, you should be consistent. Why are they both tolerated? Well, all these weeks, you've been holding the darn shift key and then hitting the quote mark to get double quotes. Now, you don't have to hit the Shift key anymore if you don't want to just speed up your code even more. And that, frankly, is probably part of the motivation for even little syntactic differences like that. 
在 CS50 和 style50 中，我们在风格上实际上会引导你使用双引号以与 C 语言保持一致，但在 Python 中，使用单引号也是完全可以接受的。但是，在风格上，你应该保持一致。为什么两者都被容忍呢？好吧，这些周以来，你一直在按着 Shift 键然后敲击引号来获取双引号。现在，如果你不想按 Shift 键，你也可以不用按，这样可以让你的代码更快。坦白说，这可能是像这样的小语法差异背后的部分动机。

All right, how about some other features that we might want to bring into the mix? We've seen use of variables already, like answer. Let's make this a little more-- let's do this side by side with Scratch and with C as well. 
好吧，我们再来看看可能需要加入的其他特性。我们已经看到了变量的使用，比如 answer。让我们和 Scratch 以及 C 语言一起，来做一个对比。

So, in Scratch, this is how we created a variable called counter and initialized it to 0. In C, we achieved that by doing int counter equals 0 semicolon. In Python, we've already seen something reminiscent of this, albeit with strings instead of integers, but probably not a logical leap to assume that this, in Python, is how you could create a variable called counter, assign it an integer, namely 0, no semicolon, no data type. And this will simply be an int because it's pretty obvious to the interpreter that 0's an int, not a string. So, of course, underneath the hood, this is going to be an int. 
因此，在 Scratch 中，我们就是这样创建了一个名为 counter 的变量并将其初始化为 0。在 C 语言中，我们通过这样做 int counter = 0;来实现。在 Python 中，我们已经看到了一些类似的东西，尽管是用字符串而不是整数，但可能不会认为在 Python 中可以这样创建一个名为 counter 的变量，给它赋一个整数，即 0，没有分号，没有数据类型。这只是一个 int，因为对于解释器来说，0 显然是整数，而不是字符串。所以，当然，在底层，这将是一个 int。

What else could we do in Scratch? We could change the counter by 1, by incrementing it, adding 1 to it. In C, we saw a few different ways to do this. We can do counter equals counter plus 1, which seems like a paradox that how could that possibly be. 
那么，在 Scratch 中我们还能做什么呢？我们可以通过增加 1 来改变 counter，即递增它，给它加 1。

But, recall, we do the addition at right. We copy the value from right to left when using the assignment operator. In Python, meanwhile, we would do this-- counter equals counter plus 1. Same exact thing, except for, of course, the semicolon no longer being necessary. 
但是，记住，我们在右边做加法。当我们使用赋值运算符时，我们会从右到左复制值。与此同时，在 Python 中，我们会这样做-- counter = counter + 1。和之前一样，只是当然，分号不再需要了。

But, in C, we could also do this-- counter plus equals 1 semicolon. Turns out you can do the exact same thing in Python without the semicolon. But there's one thing you can't do. Who knows why? But what can you probably not do? 
但是，在 C 语言中，我们也可以这样做--计数器加等于 1 分号。结果发现，在 Python 中也可以做到完全相同的事情，而不需要分号。但是有一件事你做不到。谁知道为什么？但是你大概做不到什么？

AUDIENCE: counter++.   观众：counter++。

DAVID J. MALAN: Yeah, so counter++. If you've been in the habit of using ++ and --, for better or for worse, Python does not have those. So we're back to the slightly more verbose version here. So we get two out of the three possibilities, but just a minor difference that will be ingrained over time. 
大卫·J·马尔安：是的，所以 counter++。如果你已经习惯了使用++和--，无论是好是坏，Python 都没有这些。所以我们又回到了稍微啰嗦一点的版本。所以我们得到了三个可能性中的两个，但只是随着时间的推移而根深蒂固的微小差异。

Well, what about the actual data types that Python supports? Well, we've used strings already. I just showed some integers there. Python does have its own list of data types, which is actually, at a glance, shorter than C's when it comes to the most primitive ones. 
那么，Python 支持的实际数据类型是什么呢？我们已经使用了字符串。我刚刚展示了一些整数。Python 确实有自己的数据类型列表，乍一看，它比 C 语言的最基本数据类型要短。

In C, we saw at one point pretty much this list. And then we created some of our own. In Python, this list indeed gets a bit shorter such that we have bools still for true/false values. But, as you might have glimpsed earlier, it's capital True and capital False, T and F, respectively, just because. 
在 C 语言中，我们曾经看到过这样一个列表。然后我们创建了一些自己的。在 Python 中，这个列表确实变短了，我们仍然有 bools 来表示 true/false 值。但是，正如你可能之前看到的，它们是大小写 True 和 False，T 和 F，仅此而已。

There are still floats in the world of Python, there are still ints in the world of Python, and there are strings, but they're called strs, S-T-R for short. And there are indeed some other ones as well. But there are no doubles, per se. There are no longs. Rather, Python generally uses a bit more memory so you as the programmer don't need to worry about how many bits are being used, particularly for something like integers, so more on that before long. 
在 Python 的世界里，仍然有 floats，有 ints，还有 strings，但它们被称为 strs，S-T-R。而且确实还有一些其他的类型。但是没有 doubles，也没有 longs。相反，Python 通常使用更多的内存，这样你作为程序员就不需要担心使用了多少位，尤其是对于整数这类，关于这一点，我们稍后再详细讨论。

AUDIENCE: Are there no characters? Would that be strings? 
观众：没有字符吗？那会是字符串吗？

DAVID J. MALAN: Good question. Are there no characters? Short answer, correct. There are no characters. There are only strings which can be single characters and even 0 characters because, heck, that seems sufficient rather than distinguishing between one or the other. 
大卫·J·马尔安：好问题。没有字符吗？简短的回答，是的。没有字符。只有字符串，可以是单个字符，甚至可以是 0 个字符，因为，嘿，这已经足够了，没有必要区分一个或另一个。

So if you want a character in Python, really, the best you can do is a string with a single character instead. Now, it turns out, in Python, there's going to be other features as well, data structures. So, just a week ago, we spent on week 5's material when looking at trees and tries and hash tables and more. 
所以，如果你想在 Python 中创建一个字符，实际上，最好的办法是使用一个单字符的字符串。现在，在 Python 中，你还将获得其他特性，比如数据结构。所以，就在上周，我们在第五周的材料中学习了树、tries 和哈希表等内容。

Python just gives you those and other data structures built in. No longer do you implement your own spell checker with your own dictionary. You can use, as we did earlier, a set. Turns out there are dictionaries or dict objects that come with Python that you can yourself use. 
Python 为你提供了这些以及其他内置的数据结构。你不再需要自己实现带有自己字典的拼写检查器。你可以使用，就像我们之前做的那样，一个集合。实际上，Python 自带了字典或 dict 对象，你可以自己使用。

There are tuples which are like x comma y values or latitude comma longitude, so short lists of values. There's actually lists, which are similar in spirit to C's arrays. But recall that the headache of C's arrays as of week 5 was it's not very easy to grow them or shrink them because of all the darn memory management. 
有元组，就像 x 逗号 y 值或者纬度逗号经度，所以是一些值的简短列表。实际上还有列表，它们的精神与 C 语言的数组相似。但回想一下，第五周 C 语言数组的头疼之处在于，由于所有的内存管理，它们不容易增长或缩小。

Python, if you use a list, essentially gives you a linked list automatically. You don't have to think or use any memory management or pointers at all. And range, we're going to see, just gives you a range of values. If you want to count from 1 on up to something else, range is actually a function that can give us some of that same functionality as well. 
Python，如果你使用列表，本质上会自动给你一个链表。你不必思考或使用任何内存管理或指针。至于 range，我们将看到，它只是给你一系列值。如果你想从 1 开始计数到其他某个值，range 实际上是一个可以提供一些相同功能的功能。

So let's perhaps take some of these out for a spin here. Let me go back to VS Code. Let me close up hello.py. And let's focus on maybe implementing a simple calculator as we did a few weeks ago. 
让我们也许在这里试一试这些。让我回到 VS Code。让我关闭 hello.py。然后让我们集中精力，也许实现一个简单的计算器，就像几周前我们做的那样。

In fact, let me go ahead and open up from my distribution code from lecture today wherein I brought in advance-- and these were on CS50's website-- a whole bunch of examples from earlier weeks that we already implemented together. So, for instance, in week 1, we actually implemented a calculator that prompted the user for two ints, x and y, and then simply added them together using printf in this way, with percent i as the placeholder and a second argument, which was the sum thereof. Well, if I want to implement this in Python, it's actually going to be pretty similar. 
实际上，让我先打开今天讲座中我的分发代码，其中我提前从 CS50 网站上带来了一大批之前几周我们已经一起实现的示例。例如，在第一周，我们实际上实现了一个计算器，它会提示用户输入两个整数 x 和 y，然后简单地使用 printf 以这种方式将它们相加，其中 percent i 作为占位符，第二个参数是它们的和。嗯，如果我想用 Python 实现这个，实际上会非常相似。

So let me also run code of calculator.py. That's going to open a second tab. For the sake of comparison, let me drag this over to the right so we can see these things side by side. 
让我也运行一下 calculator.py 的代码。这将打开第二个标签页。为了比较，让我把它拖到右边，这样我们就可以并排看到这些内容。

And now let me do this, from CS50's library import the get_int function, which I claim exists in that library. Then let's go ahead and create a variable called x, set it equal to get_int, and pass in a prompt of x colon space just so the user knows what we're asking for. Then let's do y equals get_int and prompt the user for a y value. 
现在，让我从 CS50 的库中导入 get_int 函数，我声称这个函数存在于该库中。然后，我们创建一个名为 x 的变量，将其设置为 get_int，并传入提示 x: 空格，这样用户就知道我们要求什么了。然后，让 y 等于 get_int，并提示用户输入 y 值。

And then, down here, let's go ahead and print out x plus y. I think it's pretty straightforward as written there. We don't mention the semicolons. We don't mention the data types. 
然后，在这里，让我们打印出 x 加 y。我认为它写得很简单。我们没有提到分号。我们没有提到数据类型。

But, for the most part, the logic is exactly the same. Let me run Python of calculator.py, type in 1, type in 2, and I do get back, in fact, 3. So that calculator seems actually to work. But let's get rid of CS50's library. 
但是，大部分逻辑都是一样的。让我运行一下 calculator.py 的 Python，输入 1，输入 2，我确实得到了 3。所以这个计算器似乎实际上是可以工作的。但是，让我们去掉 CS50 的库。

So, just as quickly as we put these training wheels on today, let's take them back off so, at the end of the week, at the end of the course, certainly, you're not relying on any of these training wheels anymore. So let me get rid of this line of code at the very top, no longer using get_int. And let's do this using Python's own built-in functionality. 
那么，就像我们今天这么快地安装这些辅助轮一样，让我们在周末、在课程结束时，当然，不再依赖这些辅助轮。让我把最上面的这一行代码去掉，不再使用 get_int。让我们使用 Python 自带的内置功能来做这件事。

So Python itself supports this here function called input, which similar to get_string and get_int and get_float takes a prompt as input. So I'm going to say x colon as before. I'm going to go ahead and say input y colon as before, and then I'm just going to print these both out using Python's own input function instead of CS50's get_int. 
Python 本身支持这里的一个函数，叫做 input，它类似于 get_string、get_int 和 get_float，也接受一个提示作为输入。所以我会说 x：，就像之前一样。我会继续说 y：，然后我会使用 Python 自带的 input 函数来打印这两个值，而不是使用 CS50 的 get_int。

Let's run Python of calculator.py again, Enter. Type in 1, type in 2, and the answer, of course, should be not 12. So what just happened here? Should still be 3. Yeah. 
让我们再次运行 Python 的 calculator.py，输入。输入 1，输入 2，答案当然应该是 12 而不是。那么这里发生了什么？应该仍然是 3。是的。

AUDIENCE: Yeah, format [INAUDIBLE] strings. 
观众：是的，格式化字符串。

DAVID J. MALAN: Yeah, so it seems that x and y came back as strings. And so what's happening with the plus operator here is it's actually being interpreted as concatenation. So I'm really saying not 12 per se, but 1 2 join together because the variable that apparently-- the return value that comes back from Python's own input function appears to be a string, that is, a str by default. 
DAVID J. MALAN: 是的，所以看起来 x 和 y 返回了字符串。所以这里的加号操作符实际上被解释为连接。我实际上说的是不是 12，而是 1 和 2 连接在一起，因为显然——Python 自己输入函数返回的值似乎是一个字符串，即默认的 str。

Now, there are ways to fix this in Python. And, in C, recall that we were able to cast some values from one to another, like ints to chars and back and forth. It's not quite as easy as that in Python because, technically, a string, as we know underneath the hood has one or more characters. Maybe there's a backslash 0 somewhere in there. 
现在，在 Python 中，有方法可以解决这个问题。在 C 语言中，回想一下，我们能够将一些值从一个类型转换到另一个类型，比如 int 到 char，然后再转换回来。在 Python 中这并不那么简单，因为从技术上讲，字符串在底层是由一个或多个字符组成的。可能其中有一个反斜杠 0。

Who knows how Python is doing it, but there is a function in Python called int, which takes as input a string. And it will do its best to convert that string to the actual int that resembles it. So if it's, quote, unquote, "1", it's going to give me the actual int known as 1 and so forth. 
谁知道 Python 是如何做到的，但 Python 中有一个名为 int 的函数，它接受一个字符串作为输入。它将尽力将这个字符串转换成与之相似的整数。所以如果它是，引号中的“1”，它将给我实际的整数 1，以此类推。

So let me do that here as well as here. Let me again run Python of calculator.py, Enter. 1 again, 2 again, and this time 1 plus 2 equals 3. So similar in spirit, but now I just needed new tool in my toolkit, this int function which does that conversion for me. 
让我在这里也做同样的事情。让我再次运行 calculator.py，输入。再次输入 1，再次输入 2，这次 1 加 2 等于 3。精神上相似，但现在我只需要工具箱中的新工具，这个 int 函数可以帮我完成转换。

Now, what actually is in this library, CS50's own that you may or may not want to use? So, in C, we had these functions as well as some other stuff, including the actual definition of string. In Python, there are indeed strings that come with the language. They're simply called strs, S-T-R. 
那么，这个库中实际上有什么是 CS50 自己的，你可能想用或者不想用？在 C 语言中，我们确实有这些函数以及一些其他的东西，包括字符串的实际定义。在 Python 中，确实有与语言本身一起提供的字符串。它们简单地被称为 strs，S-T-R。

In CS50's library for Python, though, we kept it simpler and consistent with Python the language itself. So CS50's library for Python has get_string. It has get_int. It has get_float. These we'll see are still useful because, just like in C, recall that if the user types in like cat or dog when you're actually asking them for an integer, our functions prompt the user again and again and again. 
然而，在 CS50 的 Python 库中，我们保持了简单性和与 Python 语言本身的统一性。所以 CS50 的 Python 库有 get_string。有 get_int。有 get_float。我们会看到这些仍然很有用，因为就像在 C 语言中一样，回想一下，如果你在请求用户输入整数时输入了像 cat 或 dog，我们的函数会不断提示用户再次输入。

So these functions will do that as well. We'll soon see that the input function in Python, it's quite similar to get_string, but it's not as tolerant of invalid input like cat or dog. If you're actually trying to get an int or a float, you're just going to see a scary error message instead on the screen, which we'll come back to before long. But this is to say the library is there to get you started, but not strictly necessary, ultimately. 
因此，这些函数也会这样做。我们很快就会看到 Python 中的输入函数与 get_string 非常相似，但它对无效输入（如 cat 或 dog）的容忍度不高。如果你实际上想获取整数或浮点数，你将在屏幕上看到一个可怕的错误消息，我们很快就会回到这个问题。但这是说这个库是为了让你开始，但最终并不是必需的。

But if you want to use those functions, you can do as before, from cs50, import the name of the function, and you can do this three times. If, for whatever reason in a program, you're using all three of these can just separate them by commas in this way and import all three of them here at once. Or, as you might recall earlier, you can just import the name of the library, so something like import cs50, though, the syntax thereafter changes a bit. 
但是，如果你想使用这些函数，你可以像以前一样，从 cs50 导入函数名，你可以这样做三次。如果出于某种原因在程序中使用这三个函数，可以像这样用逗号隔开，一次性在这里导入所有三个函数。或者，如你之前所回忆的，你只需导入库名，例如 import cs50，但之后的语法会有一些变化。

Before we forge ahead to now conditionals, just comparing something side by side, and then we'll build up some more interesting programs. Questions? For the most part, it's just syntactic differences and not really fundamentally different intellectual ideas under the hood just yet. 
在我们继续前进到条件语句，只是比较一些东西，然后我们将构建一些更有趣的程序之前。有问题吗？大部分情况下，这只是语法上的差异，还没有真正在底层有根本不同的思想。

So here we are with conditionals. In Scratch, if you wanted to compare x and y as variables and say conditionally x is less than y, we converted that to C as follows. The curly braces are about to go away, the semicolon's about to go away, and there's going to be one new piece of syntax here. 
所以，我们现在来谈谈条件语句。在 Scratch 中，如果你想比较变量 x 和 y，并条件性地判断 x 是否小于 y，我们会将其转换为 C 语言，如下所示。大括号即将消失，分号也将消失，这里将出现一个新的语法元素。

In Python, the same idea looks like this. What is the one piece of syntax that did get added, though, in this case? Feel free to shout it out. 
在 Python 中，这个想法看起来是这样的。不过，在这个例子中，哪一项语法被添加了呢？欢迎大声说出来。

AUDIENCE: Colon.   观众：冒号。

DAVID J. MALAN: There's a colon suddenly, which we did not have in C. It turns out, in Python, though, this is both a plus and a minus depending on your religion when it comes to whitespace in programs. So, in C, if you were not in the habit of clicking style50 and letting it guide you toward better formatted code, frankly, you could just left align everything in your C programs, and, even though it would be a mess to read, difficult to grade, it would still work. It would still be correct, but just stylistically bad. 
大卫·J·马拉恩：突然出现了冒号，这在 C 语言中是没有的。然而，在 Python 中，这既是优点也是缺点，这取决于你对程序中空格的信仰。所以，在 C 语言中，如果你没有习惯点击 style50 来引导你编写更好的格式化代码，坦白说，你可以在你的 C 程序中左对齐一切，尽管阅读起来会一团糟，评分也会困难，但它仍然可以工作。它仍然是正确的，但只是风格上不好。

In Python, it seems that humans over the years were just so darn frustrated by students and presumably colleagues alike formatting their code poorly that, in Python, indentation matters. So if you want to execute print conditional on x being less than y, you can't just put print right below if and expect the reader and the interpreter to figure things out. You must indent by convention four spaces instead. 
在 Python 中，多年来人类似乎对学生的糟糕代码格式感到非常沮丧，也许还有同事，因此 Python 中的缩进非常重要。所以如果你想根据 x 小于 y 的条件执行 print，你不可能只把 print 放在 if 下面，让读者和解释器去猜测。你必须按照惯例缩进四个空格。

You can override that, and you can adopt different paradigms within your own company or school. But four is what style50 would now expect. So this is to say, the colon means execute conditionally everything that's indented below that as though there were curly braces instead. 
你可以覆盖它，你可以在自己的公司或学校中采用不同的范式。但 style50 现在期望的是四个空格。所以这里的意思是，冒号意味着执行所有缩进在冒号下面的内容，就像有花括号一样。

All right, how about something else in Scratch? If you wanted to do an if-else, it looked like this. In C, it looked like this, which is identical except for the else block here. 
好吧，关于 Scratch 中的其他事情，如果你想做一个 if-else，它看起来像这样。在 C 语言中，它看起来像这样，除了这里的 else 块不同。

In Python, you can probably predict how this is going to get a little more succinct. No more semicolons, no more curly braces, no more backslash ends for that matter, but a colon here and a colon here. And, again, indentation matters and must be consistent, four spaces in this case for both. 
在 Python 中，你可能预测到这会变得更加简洁。不再需要分号，不再需要花括号，也不再需要反斜杠结束，但是这里有一个冒号，还有一个冒号。同样，缩进很重要，并且必须一致，在这种情况下是四个空格。

Finally, if, else if, else we did in Scratch. You can do that same thing in C almost identical, except we've got this else if. This is the only one that's weird, and even I forget how to spell this all of the time. In Python, the semicolons are about to go away, the new line is going to go away, the curly braces are going to go away, and we're going to misspell else if as such. So it's elif, in Python, colon, which is how you would implement if, elif, elif, elif, else for a conditional like this. 
最后，我们在 Scratch 中使用的 if、else if、else 语句。在 C 语言中，你可以几乎以相同的方式做到这一点，只是我们有了这个 else if。这是唯一一个有点奇怪的地方，即使是我也经常忘记这个词的拼写。在 Python 中，分号即将消失，换行符也将消失，花括号也将消失，我们将把 else if 拼写成这样。所以它是 elif，在 Python 中，是冒号，这就是你如何实现 if、elif、elif、elif、else 这样的条件语句。

Some languages very confusingly use else if or elsif but no e and probably shouldn't've said that because now you'll be as confused as I have been for years. But let's move on to what we can actually do now with these here strings. So we know what we can use these conditionals in this way. Let's go ahead now and revisit some programs from C but this time using some new syntax and features. 
一些语言非常令人困惑地使用 else if 或 elsif，但没有 e，可能也不应该这么说，因为你现在会和我一样困惑好几年。但让我们继续讨论我们现在可以用这些条件语句做什么。我们知道我们可以这样使用这些条件语句。现在让我们回顾一些 C 语言的程序，但这次使用一些新的语法和功能。

So let me go back to here VS Code. Let me open up in one window here. How about compare3.c? 
让我回到这里 VS Code。我在一个窗口中打开它。比较 3.c 怎么样？

So this was from today's distribution code, a file called compare3.c, which we looked at some time ago. And what this program did, quite simply, is exactly what we just saw on the screen, but with a full-fledged main function and the header files and the like. But all this program does is tell us whether x is less than y or not. 
今天分发的代码中有一个名为 compare3.c 的文件，我们之前已经研究过。这个程序很简单，就是我们在屏幕上看到的内容，但是有一个完整的 main 函数和头文件等。但这个程序所做的只是告诉我们 x 是否小于 y。

All right, how can we go about implementing this in Python? Pretty straightforward. Let me open my terminal. Let me do code of compare.py for this version. Let me drag it over to the right so I can see these things side by side and hide my terminal again. 
好的，我们如何在 Python 中实现这个功能呢？很简单。让我打开我的终端。让我编写一个名为 compare.py 的代码。让我把它拖到右边，这样我就可以并排看到这些内容，然后再把终端隐藏起来。

Let's go ahead and import from cs50 the get int function just to make our lives a little easier for now. Let's use x equals get_int and prompt the user for What's x question mark, just like I did at left. Let's do y equals get_int, passing in, What's y question mark, just like at left. 
让我们先从 cs50 导入 get_int 函数，这样我们的生活就会轻松一些。让我们使用 x = get_int，提示用户输入“x 是多少？”，就像我在左边做的那样。让我们做 y = get_int，传递“y 是多少？”这样的提示，就像在左边一样。

Then let's just do if x is less than y colon, Enter. And, notice, VS Code is not only smart enough but deliberately configured by us to know something about Python. So it automatically indented for me. Just like C very often has to. 
然后，让我们做 if x < y: Enter。注意，VS Code 不仅足够智能，而且是我们故意配置的，以便了解 Python 的一些内容。所以它自动为我缩进了。就像 C 语言经常需要做的那样。

Let's print out x is less than y quote unquote. Elif x greater than y colon, then let's print out x is greater than y, close quote. Else colon print out x is equal to y. So nothing different versus the slides, but you can kind of see visually just how much more compact the code is, like 11 actual lines instead of 21. So it's just eliminating a lot of distraction and clutter and tightening things up. If nothing else, let's go ahead and run Python of compare.py, Enter. Let's type in 1, type in 2, and let me just wave my hand at the reality that I'm pretty sure the code is correct and would work correctly if we typed in 2 and 1 or 1 and 1, 2 and 2, and so forth. 
让我们打印出 x 小于 y 的引号内的内容。如果 x 大于 y，则打印出 x 大于 y，关闭引号。否则：打印出 x 等于 y。所以与幻灯片相比没有太大不同，但你可以从视觉上看出代码的紧凑性，比如实际只有 11 行而不是 21 行。所以它只是消除了很多干扰和杂乱，使事情更加紧凑。如果其他什么都没有，我们就继续运行 Python 的 compare.py，输入。让我们输入 1，输入 2，然后让我挥挥手表示我相当确信如果输入 2 和 1 或 1 和 1，2 和 2 等等，代码是正确的并且会正确运行。

So this is to say that comparing integers in Python logically works exactly the same way as in C, but things, recall, in Python got a little weirder when we actually tried comparing, say, strings instead. And recall that when we compared strings in Python, we had a solve a problem we encountered. The very first time we compare two strings in C, s and t, as I think I called them weeks ago, they were never the same according to my first version of my code. Why is it harder to compare strings in C? 
所以这是要说，在 Python 中比较整数在逻辑上与 C 语言完全相同，但记得，当我们实际比较字符串时，Python 会变得有点奇怪。记得当我们比较 Python 中的字符串时，我们遇到了一个问题。当我们第一次在 C 语言中比较两个字符串 s 和 t（我想我几周前这么称呼它们）时，它们在我的代码的第一个版本中从未相同。为什么在 C 语言中比较字符串更难？

AUDIENCE: The address [INAUDIBLE] the wrong address. 
观众：地址[听不清]是错误的地址。

DAVID J. MALAN: Exactly. So recall from week 4, where we really looked underneath the hood and we realized that, oh, a string is really a char star, which is the address of the first character in the string. So whenever you compare two strings with equals equals in C, you're really comparing the memory addresses, and those probably are not going to be the same. So even if the strings look the same, they're always different. That was a pain in the neck. We had to add in the string library and the str compare function, str comp-- strcmp. It was just a lot of work to do something so darn common. It is super common to want to compare strings. 
DAVID J. MALAN: 确实。回想一下第 4 周，我们深入底层，意识到哦，字符串实际上是一个 char*，即字符串第一个字符的地址。所以当你用 C 语言中的等于等于（==）比较两个字符串时，你实际上是在比较内存地址，这些地址可能并不相同。所以即使字符串看起来相同，它们总是不同的。这真是个头疼的问题。我们不得不添加字符串库和字符串比较函数，str comp-- strcmp。这只是为了完成一件非常常见的事情。比较字符串是非常常见的操作。

In Python, wonderfully-- let me close the int-based version from C here-- let me propose here that in Python, if you want to manipulate strings, you could use CS50's own get_string function. But I don't even need that. I can use the input function, as we saw earlier. So if I want to prompt the user for s equals, the return value of input, and just prompt them for a string like s. t equals the input function-- prompt them for a string called t. 
在 Python 中，非常棒——让我先关闭基于整数的 C 版本——在这里我提出，在 Python 中，如果你想操作字符串，可以使用 CS50 的 get_string 函数。但我不需要那个。我可以使用我们之前看到的 input 函数。所以如果我想提示用户输入 s 等于，input 函数的返回值，并提示他们输入一个字符串 s。t 等于 input 函数——提示他们输入一个名为 t 的字符串。

In Python, wonderfully, it works the way you would hope. If s equals equals t, then print out, quote unquote, "Same." Else, print out, quote unquote, "Different." So here, again, it just works the way you would hope. And you don't have to pull out your textbook or your old examples to figure out how to do something relatively straightforward-- conceptually is comparing two strings. 
在 Python 中，奇妙的是，它按照你希望的方式工作。如果 s 等于等于 t，那么打印出，“相同”。否则，打印出，“不同”。所以在这里，它再次按照你希望的方式工作。而且你不必拿出你的教科书或你以前的老例子来弄清楚如何做相对简单的事情——从概念上讲是比较两个字符串。

Let's do one other example that evokes a past example as well. Let me open up a program that, in week one, we called agree.c. So at left, here is a program that we wrote several weeks ago now that used the CS50 library, the standard IO library. It used the getchar function to ask the user, do you agree with some terms and conditions or whatever. And then we use this syntax, which was very new in week one because not only were we using equals equals, we used the vertical bars, which meant what logically? Or. So we used or to detect if someone typed in uppercase or lowercase for either y-- or big Y, little y or big N, little n as well. 
让我们再举一个例子，这个例子也唤起了以前的例子。让我打开一个程序，我们在第一周称之为 agree.c。所以在这里左边是一个我们几周前写的程序，它使用了 CS50 库，标准 IO 库。它使用了 getchar 函数来询问用户，你是否同意某些条款和条件等等。然后我们使用了这种语法，这在第一周是非常新的，因为我们不仅使用了等于等于，我们还使用了竖线，这在逻辑上意味着什么？或者。我们使用了或来检测是否有人输入了大写或小写的 y——大 Y，小 y，或者大 N，小 n。

So, in Python, let's do this instead-- code of agree.py. I'll hide my terminal window, but I'll drag this here over at left. And in the Python version of this, turns out, I can do something similar as follows. Let's do S equals input and prompt the user, do you agree, question mark. Then let's say if s equals equals quote unquote y or s equals quote unquote little y, then print out quote unquote "Agree," just like in the C version. Elif s equals equals capital N or s equals equals lowercase n, then print out "Not agreed," just like in the C version. 
因此，在 Python 中，我们这样做——这是 agree.py 的代码。我会隐藏我的终端窗口，但我会把它拖到左边。在 Python 版本中，我发现我可以这样做。让我们让 S 等于 input，提示用户，你同意吗？然后，如果 s 等于单引号 y 或者 s 等于单引号小写 y，就打印出“同意”，就像 C 版本一样。否则，如果 s 等于大写 N 或者 s 等于小写 n，就打印出“不同意”，就像 C 版本一样。

And here, again, we're sort of seeing just how much this condenses our code. It's working logically the same, but what are some of the differences visually? Well, there's no curly braces, there's no semicolons, there's no new lines. But what is there? This is why Python 2 is considered more user-friendly. If you want to express the idea of "or," literally write "or" instead of vertical bars and double ampersands and the like. So I'm using or here as well as or here. 
在这里，我们再次看到代码是如何变得如此紧凑的。逻辑上它仍然在起作用，但视觉上有哪些不同呢？没有花括号，没有分号，没有换行。但是有什么呢？这就是为什么 Python 2 被认为更易于使用。如果你想表达“或”的概念，就直接写“or”，而不是竖线、双与号等等。所以我在这里也使用了“or”，同样在这里也使用了“or”。

Notice there's no parentheses either around these conditionals. So we didn't see those on the slides. We don't see them here. What Python does with parentheses is that if you don't need them logically to combine Boolean expressions, just don't use them at all. You could use them here and here and here and here. But if it's not necessary, why bother further cluttering your code? You simply do not need to do it. 
注意这里既没有括号包围这些条件。所以我们没有在幻灯片上看到它们。这里也没有看到。Python 对括号的处理是这样的：如果你在逻辑上不需要它们来组合布尔表达式，就根本不用它们。你可以在这里、这里、这里和这里使用它们。但如果不是必要的，为什么要进一步使你的代码变得杂乱无章呢？你根本不需要这样做。

But let's see if there's a way to improve this. Let me first run this and make sure it works as intended-- python of agree.py. Do I agree? An emphatic yes. Let's do a lowercase n. And agreed and not agreed are indeed the answers I get back. 
但让我们看看是否有改进的方法。我先运行一下，确保它按预期工作--运行 python of agree.py。我同意吗？一个坚决的“是的”。让我们用小写 n。同意和不同意确实是返回给我的答案。

But this feels a little redundant, I would say. Notice that my code here is really just asking the same question twice, albeit for lowercase, and it's asking the same question twice here, albeit for lowercase for the n as well. Well, it turns out, in Python, I can actually tighten this up. 
但我觉得这有点冗余。注意，我这里的代码实际上只是在问同一个问题两次，尽管是针对小写的，而且在这里也是，尽管是针对小写的 n。不过，在 Python 中，我实际上可以把它简化一下。

Let me get rid of my C version and focus on this one, and let me go ahead and condense this further as follows. If s is in the following list of values, quote unquote, "Y," quote unquote, little "y", colon, and then, down here, I'm going to do the exact same thing, logically. Elif s is in this list of comma-separated values, capital N, lowercase n, this now would achieve the same result. It's a little tighter because I'm not using or. I'm not using equals equals four times. I'm using it not at all, in fact. I'm using a new keyword which, in Python, exists-- "in"-- as a preposition-- is a Python keyword, does not exist in C. But this here would be a little tighter as well. 
让我把 C 版本的代码去掉，专注于这个版本，并且进一步精简如下。如果 s 在以下列表中的值，即“Y”，即小写的“y”，冒号，然后在这里，我将做完全相同的事情，逻辑上。如果 s 在这个逗号分隔的值列表中，大写 N，小写 n，这将达到相同的结果。它更紧凑，因为我没有使用“或”。我没有使用四个等于号。我实际上一个都没有用。我使用了一个新的 Python 关键字，它作为一个介词存在——“in”——在 C 语言中不存在。但这也更紧凑。

So let me go ahead and run Python of agree.py, Enter. Do I agree? Capital Y-- it still works. Or if I do lowercase y, it still works. But this isn't as featureful as would be ideal because what if the user types in, for instance, an emphatic YES in all caps? Well, now it just ignores me altogether. Now you could go in and, of course, address that. I could do capital YES and lowercase yes. But wait a minute, what if they just capitalize the first letter? So I should really have y. 
所以我先运行一下 Python 的 agree.py，输入。我同意吗？大写 Y——它仍然有效。或者如果我输入小写 y，它仍然有效。但这并不像理想中的那样功能丰富，因为如果用户输入，比如，全部大写的强调 YES 怎么办？现在它就完全忽略我了。当然，你可以去解决这个问题。我可以做大小写 YES 和小写 yes。但是等等，如果他们只把第一个字母大写怎么办？所以我应该有 y。

And then, well, what if their Caps Lock is not working as intended, and maybe we do something like this? And now we've got to do this. I mean, these are all spelled the same, even if they're miscapitalized. So this just feels like it's becoming a mess pretty quickly. So, logically, whether it's in C now or in Python, what would ideally be a better logical solution to this than enumerating all possible values that we care about? Yeah? 
然后，嗯，如果他们的 Caps Lock 没有按预期工作，我们可能会这样做？现在我们必须这样做。我的意思是，即使它们被误拼，它们也拼写得一样。所以这很快就变成了一团糟。所以，从逻辑上讲，无论是现在在 C 中还是在 Python 中，与列举所有我们关心的可能值相比，什么才是理想的解决方案呢？是的？

AUDIENCE: Change the input to lowercase. 
观众：将输入转换为小写。

DAVID J. MALAN: Yeah, why don't we just change the user's input to lowercase or equivalently-- just change it to uppercase, to canonicalize it, make it the way I expect it to be, and then compare it against a much shorter, finite list of values? 
大卫·J·马尔安：是的，我们为什么不直接将用户的输入转换为小写，或者等价地——将其转换为大写，使其规范化，使其成为我期望的样子，然后与一个更短、有限的值列表进行比较？

So how do we do this? Well, in the C type library, we had a tolower function, which was handy, and we had toupper. But in Python, what's nice is that Python actually has not only strs, or strings, as first-class objects that come with the language itself, Python itself as a language is known as an object-oriented language. And it has other features as well. And some of you in high school, if you ever studied Java or the like, you might already know about object-oriented programming, otherwise known as OOP. 
那么，我们该如何做呢？嗯，在 C 类型库中，我们有一个 tolower 函数，这很方便，还有一个 toupper。但在 Python 中，Python 本身作为一个语言，不仅将字符串（strs）作为一等对象，而且 Python 本身也是一种面向对象的语言。它还有其他一些特性。对于那些在高中学习过 Java 或类似语言的人来说，你们可能已经知道这种编程方式，也就是所谓的面向对象编程（OOP）。

And what this is referring to is a new and improved version of C structs. Recall that in C we had structs whereby we could create our own data types for like persons or nodes-- for instance, by creating our own data types that have one or more other values inside of them. 
这指的是 C 结构体的一个新版本和改进版。回想一下，在 C 中，我们有结构体，我们可以创建自己的数据类型，比如人或者节点——例如，通过创建包含一个或多个其他值的自定义数据类型。

Well, what C doesn't offer you-- at least not easily-- is to associate functionality with those structures as well. For instance, for a person object, wouldn't it be nice if there were a function, especially if running the code on your phone, that was a call function that would just automatically call that person or an email function that would just automatically email that person if we're keeping track of their email address as well? Well, you could implement a call function and pass the person in as input. You could implement a call function and pass the person in as input, and then it would work. 
嗯，C 语言无法轻易提供的是将功能与这些结构关联起来。例如，对于一个人物对象，如果有一个函数，尤其是在手机上运行代码时，可以自动调用该人物，或者有一个自动发送电子邮件的函数，如果我们还记录了他们的电子邮件地址，那岂不是很好？你可以实现一个调用函数，并将人物作为输入传递。你可以实现一个调用函数，并将人物作为输入传递，然后它就会工作。

But wouldn't it be nice to associate more tightly and encapsulate related functionality, just like we've been encapsulating related data? And this is what object-oriented programming allows you to do. Instead of having what are called structs in C, you have what are called objects in Python and certain other languages as well. And those objects are typically defined-- what's called a class, when a Class is really just like a blueprint or a template out of which multiple objects can be made. 
但不是更好吗，将相关功能更紧密地关联和封装，就像我们一直封装相关数据一样？这正是面向对象编程允许你做到的。在 C 语言中，我们通常有所谓的结构体，而在 Python 以及其他某些语言中，我们有所谓的对象。这些对象通常是通过所谓的类来定义的，而类实际上就是一个蓝图或模板，可以根据它创建多个对象。

And, specifically, in the context of this here example, we could consult the documentation for the functions that come with the str object, the string object. And technically, whenever functionality is associated with a specific data type, it's encapsulated inside-- it's still a function, but you technically call it a method, in that case, instead. So a function is what all we've been discussing in C and in Scratch. In Python, you still have functions, but if those functions are associated with a data type, tucked away inside of them, then they're just also called methods. It's a minor nuance there. 
在这个具体示例的背景下，我们可以查阅与 str 对象或字符串对象相关的文档。从技术上讲，每当功能与特定数据类型相关联时，它都封装在其中——它仍然是一个函数，但在这个情况下，你实际上称之为方法。所以，函数就是我们一直在 C 和 Scratch 中讨论的内容。在 Python 中，你仍然有函数，但如果这些函数与数据类型相关联，隐藏在它们内部，那么它们也可以被称为方法。这只是一个小细节。

And among the functions, among the methods, rather, that comes with strs, or strings, is a little something called lower. And there's different ways to go about doing this. So let me go ahead and, one, simplify this list to just be the list of values that I actually care about. So let's suppose that I want to support, quote unquote, "y" and quote unquote, "yes," but I don't care about the capitalization thereof. 
在与 strs 或字符串相关的方法中，有一个小功能叫做 lower。处理这个问题的方法有很多。所以，让我先简化这个列表，只保留我真正关心的值列表。假设我想支持所谓的“y”和“yes”，但我并不关心它们的字母大小写。

So I could do this. I could take the s variable and I could-- actually, let's do this. I can create another variable, t, set it equal to s.lower, open paren, close paren. So notice the dot operator, just like in C, goes inside of the object. Same thing in Python, but here, I'm not going inside of it to get the person's name or their number or their email address. I'm going inside of it to call a method that just comes with that type of value. 
因此我可以这样做。我可以创建一个变量 t，将其设置为 s.lower()。注意点操作符，就像在 C 语言中一样，它位于对象内部。在 Python 中也是如此，但在这里，我并不是要进入对象内部获取人的姓名或电话号码或电子邮件地址。我是要进入对象内部调用与该类型值相关联的方法。

So in C, just to be super clear, we would have done tolower and pass in s. Python-- in an object-oriented programming more generally-- just kind of flips that paradigm and says start with the variable in question and call its own lowercase method as such. And now, if I change this code to t, down here and here, and I go in here and I search for lowercase n or lowercase no, and I run this version of agree.py, Enter, I can now type in "Y" for yes, capitalized, "y" for yes lowercase, YES all capitalized for yes, y lowercase capital S, like that, any of those variants that exist, and I only have to enumerate canonical versions thereof. 
所以为了更清楚，在 C 语言中，我们会这样做 tolower(s)。Python——在面向对象编程中——基本上是反转了这个范式，它说从变量本身开始，调用其自己的 lower 方法。现在，如果我将这段代码中的 t 替换掉，在这里和这里，然后我进入这里搜索 lowercase n 或 lowercase no，并运行这个版本的 agree.py，按 Enter 键，我现在可以输入"Y"表示是，小写的"y"表示是，全部大写的 YES，小写的 y 大写的 S，诸如此类，任何存在的变体，我只需要列举其规范版本。

Even better, I can tighten this up further. I don't really need a t variable. In fact, I could just do s equals s.lower and change the value of s to be the lowercase version thereof. What's nice about Python, too, is you can chain method calls together. So if you know that input as a function already returns a string, you don't need to tuck it in a variable before you call that string's lower method. And you can just chain them together in this way. 
甚至可以进一步简化。实际上，我根本不需要一个 t 变量。实际上，我可以直接将 s 等于 s.lower，并将 s 的值改为小写版本。Python 的另一个优点是你可以链式调用方法。所以如果你知道 input 函数已经返回了一个字符串，你不需要在调用该字符串的 lower 方法之前将其存储在一个变量中。你只需以这种方式链式调用它们。

And you could do this sort of again and again. This is not a real function, but you could keep chaining these things together one or more times. At some point, it's going to look stupid because it's just going to be too long of a line of code, and then we get into discussions of style. But for now, having two function calls like this is pretty reasonable, I would argue. And so this just tightens up the code further. 
你可以反复这样做。这其实不是一个真正的函数，但你可以在一个或多个地方重复使用这种链式调用。但最终，这会看起来很愚蠢，因为代码行会太长，然后我们就会进入关于风格的讨论。但就目前而言，我认为使用两个这样的函数调用是相当合理的。这样可以使代码更加紧凑。

So that is perhaps the newest feature that we've now seen of Python, this notion of methods, which derives from this feature of object-oriented programming. But any questions before we take a quick tour of a few other features as well? No? OK, about a couple more examples, then introduce some loops, and we'll skate our way toward some snacks in just a few. 
因此，这可能是我们现在看到的 Python 的最新特性，即方法的概念，它源于面向对象编程的这种特性。但在我们快速浏览其他一些特性之前，有什么问题吗？没有？好的，再举几个例子，然后介绍一些循环，我们就可以轻松地走向一些小吃，只需几分钟。

So let me propose that we look at one other problem from our week 4, where in memory and the fact that it exists and has to be managed by us was creating some underlying problems. So let me open up a program from week 4 that was called copy5.c. At least that was our several iterations in. And that program looked a little something like this. And I'll just skim it for a second. This was getting kind of annoying just to copy one string into another. So I had to use all of these libraries in C. I used CS50's get_string function still, but this is when we took the training wheels of strings off, quote unquote, and started talking about them as char stars. 
让我提出，我们再看看我们第 4 周的一个问题，即在内存中存在的事实以及它必须由我们管理，这造成了一些潜在问题。让我打开第 4 周的一个程序，它被称为 copy5.c。至少那是我们的几次迭代。这个程序看起来有点像这样。我简要地浏览了一下。把一个字符串复制到另一个字符串变得有点烦人。所以我不得不使用所有的 C 库。我仍然使用了 CS50 的 get_string 函数，但这是当我们把字符串的训练轮子摘掉，所谓地，开始把它们当作 char*来谈论的时候。

I checked to make sure that s is not null, just in case we're out of memory for some reason. I used malloc, ultimately, to create more memory, to get more memory for the copy, but still checking if it's null. I then copied the string from one to the other using strcpy. I then made sure the string was long enough, and then I uppercased the first letter in it. Then I printed them out, then I freed the string, and so forth. Like, it was a lot of work just to make a copy of a string, which in programming in general, it'd be nice if you could just do it more simply. 
我检查了 s 是否为空，以防万一我们因为某种原因内存不足。我最终使用 malloc 来创建更多内存，为复制获取更多内存，但仍然检查它是否为空。然后我使用 strcpy 将字符串从一个复制到另一个。然后我确保字符串足够长，然后将其中的第一个字母转换为大写。然后我打印出来，然后释放字符串，以此类推。就像，仅仅为了复制一个字符串，在编程中通常希望可以更简单地完成。

So in Python, here too, it's as simple as that. Let me go into VS Code, open up a new file called copy.py Then let me put these two side by side. And in the right-hand version in Python, let's do this. s equals input, and prompt the user as before for a string like s, quote unquote. Then let's go ahead and create a second variable called t, set it equal to the s variables, capitalize methods return value, and then print out down here-- how about s and then print out t. 
所以在 Python 中，这也很简单。让我进入 VS Code，打开一个名为 copy.py 的新文件。然后让我将这两个并排放置。在 Python 的右侧版本中，让我们这样做。s 等于 input，像之前一样提示用户输入一个字符串 s，引号内的。然后让我们创建一个名为 t 的第二个变量，将其设置为 s 变量的 capitalize 方法返回值，然后在这里打印出来--打印 s，然后打印 t。

Let me open my terminal. Let me run Python of copy.py. Recall that, last time, when I did "hi!," it capitalized the whole thing, as I recall, as opposed to capitalizing just the first letter. Enter-- this time, it works as expected. Now the print is technically a little different. Down here, I use these format strings. 
让我打开我的终端。让我运行 Python 的 copy.py。回想一下，上次当我输入"hi!"时，整个单词都变成了大写，正如我回忆的那样，与只大写首字母相反。这次，它按预期工作。现在打印确实有点不同。在这里，我使用这些格式字符串。

So if I really want to make this identical, I can do f quote unquote s colon and then plug in the value of s with curly braces, f quote unquote t colon t. This looks uglier, but it's just now printing out prefixes, s and t respectively. So if I run this again and do hi in all lowercase, it capitalizes it correctly for t and only for t. So here, more so than ever, 33 lines of code at the left, 6 lines, two of which are blank at right in Python. Questions about this here example? Yeah? 
所以如果我真的想让它完全一样，我可以这样做：f'"{s}"：{s}，然后插入 s 的值，用花括号括起来，f'"{t}"：{t}。这看起来更丑，但现在它只是打印出前缀，分别是 s 和 t。所以如果我现在再次运行并输入全部小写的 hi，它将正确地只为大写 t。所以在这里，比以往任何时候都更明显，左边有 33 行代码，右边有 6 行，其中两行是空的 Python 代码。关于这个例子有什么问题吗？是的？

AUDIENCE: [INAUDIBLE] question about style. Those blank lines [INAUDIBLE] not make it all [INAUDIBLE]? 
观众：[声音不清楚]关于风格的问题。那些空白行[声音不清楚]不会让它都[声音不清楚]？

DAVID J. MALAN: Those blank lines-- do you mean get rid of the blank lines? Oh, you absolutely could. I have been doing this visually just to make related chunks of code stand out. So I got s, then I capitalize t, and then I printed them both, but yes, you could totally format this in different ways, just as I did at left as well. Other questions about what we've done here? 
大卫·J·马兰：那些空白行——你是想删除空白行吗？哦，你当然可以。我之前只是从视觉上这样做，以便让相关的代码块更加突出。所以我先写 s，然后大写 t，然后打印它们两个，但是是的，你也可以用不同的方式格式化，就像我在左边也做的那样。还有其他关于我们在这里做了什么的问题吗？

How about this? Let me propose that, in C, we also at one point try to just uppercase everything in a string. So let me open up what was a program called, from week 2, uppercase.c, or really version 2 thereof here. And this was a program that looks a little cryptic, but all it does was ask the user for a string, the before version. It then printed out after colon. It's just a placeholder for an uppercase version thereof. We then use strlen and this for loop to iterate over all of the characters in the string. And then, one at a time, we use the C type library's toupper function to capitalize them again and again. 
那么，我们来看看这个。让我提出，在 C 语言中，我们也在某个时刻尝试将字符串中的所有内容都转换为大写。那么，让我打开一个叫做“第 2 周”的程序，叫做 uppercase.c，或者更确切地说，是其第 2 个版本。这是一个看起来有点神秘的程序，但它所做的只是要求用户输入一个字符串，即原始版本。然后它打印出“之后：”。它只是一个用于打印大写版本的占位符。然后我们使用 strlen 和这个循环来遍历字符串中的所有字符。然后，我们一次又一次地使用 C 类型库中的 toupper 函数将它们转换为大写。

So you can probably imagine where this is going. We don't need toupper anymore. We can just use dot upper in some way. But we do need to have the ability to do things with loops. So, in Python, we still have loops, but the syntax is going to be a little different and, frankly, a little easier, ultimately. So in Scratch, if you wanted to repeat something three times like this, you could implement it in C very mechanically, so to speak, like this-- create a variable i, increment it with plus plus again and again and again, so long as it's less than three printing meow each time. 
你可能可以想象这会走向何方。我们不再需要 toupper 了。我们可以以某种方式使用 dot upper。但是，我们确实需要具备使用循环的能力。所以，在 Python 中，我们仍然有循环，但语法会有点不同，坦白说，最终会更简单。所以，在 Scratch 中，如果你想重复三次这样的操作，你可以用 C 语言非常机械地实现它——创建一个变量 i，反复用++增加它，只要它小于 3，就每次打印 meow。

In Python, you can do the exact same thing, if you really want, by saying variable equals value, but no semicolon, no data type, while i less than 3 colon. So just like conditionals, you don't need parentheses if they're not logically necessary. But you do need the colon, and you do need indentation. You don't have the plus plus, so we have to do this slightly more verbose Python version here, but that's exactly the same idea to implement meowing three times. 
在 Python 中，如果你真的想，你可以通过说变量等于值来做完全一样的事情，但不需要分号，没有数据类型，while i 小于 3：。所以，就像条件语句一样，如果它们不是逻辑上必要的，你不需要括号。但是，你需要冒号，你需要缩进。我们没有++，所以我们必须用这个稍微冗长的 Python 版本，但这正是实现重复 meow 三次的相同想法。

Suppose, though, that we wanted to take a different approach here. We could, in C, use not a while loop but a for loop. And maybe you're nowadays in the habit of using these a bit more. They're a little more succinct without all of the vertical clutter. But this is how we could implement the same in C. 
假设，尽管如此，我们想要在这里采取不同的方法。在 C 语言中，我们可以使用不是 while 循环而是 for 循环。也许你现在已经习惯了更多地使用这些循环。它们更加简洁，没有那么多垂直的杂乱。但这就是我们在 C 语言中实现相同功能的方法。

In Python. It's not quite as obvious how to do this, but we could do it this way. We could say for i in the following list of values-- and literally in square brackets, as I did earlier, just enumerate one after the other the things I want to check for. Instead of y and yes and no and n, I can iterate over three values. 
在 Python 中，这样做并不那么明显，但我们可以这样做。我们可以这样写：for i in 以下值的列表--就像我之前做的那样，用方括号逐个列举我想要检查的内容。而不是 y、yes、no 和 n，我可以遍历三个值。

This is fine, but just allow your mind to wander, if it hasn't already, into thinking how this could get us in trouble. Why is this approach of just enumerating 0, 1, and 2 probably not the best way long term to do this? What do you think? Yeah? 
这是可以的，但请让你的思绪随意飘散，如果还没有的话，想想这样可能会让我们陷入什么麻烦。为什么仅仅列举 0、1 和 2 的方法从长远来看可能不是最好的？你怎么看？是的？

AUDIENCE: What if you need a lot of values, like 100? 
观众：如果你需要很多值，比如 100 个呢？

DAVID J. MALAN: Yeah, are you really going to go-- what if you need a lot of value, like 100 of them? Are you really going to do 0 comma 1 comma 2 comma 3 dot, dot, dot to comma 99? That's got to be a better-- there's got to be a better way than that, if only because it's going to wrap around the screen. I'm going to miscount and screw something up. 
大卫·J·马兰：是的，你真的要这样做吗——如果你需要很多值，比如 100 个呢？你真的要一个接一个地数，从 0 到 99 吗？这肯定有更好的方法——肯定有更好的方法，因为这样会绕过屏幕。我会数错，搞砸某件事。

So indeed there is. You can alternatively use a function in Python called range, which does, as I said earlier, give you a range of values. And if you want a range of three values, starting at 0 by default, and going up to but not through this value, you literally call the range function and say, how many values do you want? 
确实如此。你可以使用 Python 中的一个名为 range 的函数，正如我之前所说的，这个函数可以给你一个值的范围。如果你想得到一个从 0 开始（默认值），到但不包括这个值的三个值的范围，你只需调用 range 函数，并说出你想要的值的数量。

And, essentially, what the range function does is it hands you out one value at a time more efficiently than the hardcoded list, which puts them all in memory at once. Range is a little smarter and it knows how to give you, indeed, just one value at a time. But notice here, I'm using for i in range of 3, which is similar in spirit to C, because I have this variable i but I'm not actually using i anywhere. I'm not incrementing it. I'm not comparing it against a value. So strictly speaking, in Python, this is correct. 
并且，本质上，range 函数所做的就是一次给你一个值，比一次性将它们全部放入内存的硬编码列表更高效。range 函数稍微聪明一些，知道如何一次只给你一个值。但请注意，这里我使用的是 for i in range(3)，在精神上与 C 语言相似，因为我有一个变量 i，但实际上我并没有使用 i。我没有递增它，也没有将它与某个值进行比较。所以严格来说，在 Python 中这是正确的。

But stylistically, some people would actually, by convention, change the i to just an underscore character, which is a valid character for a variable, but it's just this visual indicator that yes, this is a variable because for loop requires it in Python, but who cares what it's called because I'm never actually going to use it. So you'll see this convention sometimes but perfectly reasonable to also use i by convention because i means integer, and that's really what's happening anyway. But just FYI-- a convention there in Python. 
但从风格上讲，有些人实际上会按照惯例将 i 改为下划线字符，这是一个有效的变量字符，但只是这个视觉指示符，表明这是一个变量，因为 Python 中的 for 循环需要它。但谁在乎它叫什么名字呢，因为我永远不会真正使用它。所以你有时会看到这个惯例，但按照惯例使用 i 也是完全可以接受的，因为 i 代表整数，而这正是实际发生的事情。但只是了解一下——这是 Python 中的一个惯例。

So how can we now use these loops in some actual code? Well, let me propose that what we could do here is the following. Let me go back to VS Code here in my uppercase version, and let me quickly whip up a Python version that achieves something quite similar. Let me go ahead and run code of uppercase.py at top left, after dragging this over. 
那么，我们如何在实际代码中使用这些循环呢？好吧，让我提出一个建议，我们在这里可以这样做。让我回到 VS Code 这里，在我的大写版本中，让我快速写一个 Python 版本，实现类似的功能。让我先运行一下左上角的 uppercase.py 代码，之后将这段代码拖动过来。

Let's go ahead and implement the following. In a variable called before, set it equal to the return value of the input function with quote unquote "Before" as the prompt. Then let's just do a placeholder of quote unquote "After" colon space, space, so they lined up in terms of numbers of letters, close quote, comma, but let me do end equals quote unquote because I don't want a new line to move the word below the word After. So this is just a silly aesthetic detail, but that overrides the default new line to being no new line. 
让我们继续实现以下内容。在一个名为 before 的变量中，将其设置为 input 函数返回的值，提示为“Before”。然后我们只需做一个占位符，“After”冒号空格，空格，这样它们在字母数量上对齐，关闭引号，逗号，但是让我用 end 等于 quote unquote，因为我不想换行将下面的单词移动到 After 下面。这只是一个小小的美学细节，但是它覆盖了默认的换行，使其没有换行。

Now let's do this. In Python, instead of using this convoluted for loop and the semicolons that in and this constant checking of a conditional, I can actually just do this. For every character called c in the Before string, go ahead and print out that character uppercase, like that. But don't print out a new line yet until we get to the very end, go ahead and print a new line-- by printing nothing, but by default, I'm going to get a new line. So passing nothing in gives me one new line, and that's it. 
现在让我们来做这件事。在 Python 中，我实际上可以这样做。对于 Before 字符串中的每个字符 c，先打印出该字符的大写形式，就像那样。但是不要打印新行，直到我们到达最后，然后打印一个新行——通过打印空内容，默认情况下，我会得到一个新行。所以传递空内容给我一个新行，就这么多。

So let me open VS-- let me open my terminal. Run Python of uppercase.py, hi exclamation point in lowercase, Enter, and I've messed something up. Not intentional, but so be it. Notice the error here. So this is-- I can make this work. So there's these things in Python called tracebacks which kind of trace backwards what you did wrong. And, in this case, what I did wrong, as for all of these carrot symbols, is c dot uppercase is bad, but you probably already know that from earlier. What I should have typed? 
让我打开 VS——让我打开我的终端。运行 Python uppercase.py，hi 感叹号小写，Enter，我搞砸了。不是故意的，但就这样。注意这里的错误。所以 Python 中有一种叫做 tracebacks 的东西，它可以追踪你做错的地方。在这个例子中，我犯的错误是，对于所有这些箭头符号，c.upper 是错误的，但你应该从之前就知道了。我应该输入什么？

AUDIENCE: Dot upper.   观众：点大写。

DAVID J. MALAN: So dot upper. So there's a lot of distraction here. But much like Clang's output, there is some helpful information. One, the file in question is uppercase.py. Line 4 is where I made the mistake. So even though the output is different from Clang's, it is similar in spirit. Specifically, I messed up an attribute error because some string object doesn't have an attribute that is a method called uppercase. 
DAVID J. MALAN：所以点上面。这里有很多干扰。但就像 Clang 的输出一样，也有一些有用的信息。一是，问题文件是 uppercase.py。第 4 行是我犯错误的地方。所以尽管输出与 Clang 的不同，但精神上相似。具体来说，我犯了一个属性错误，因为某些字符串对象没有名为 uppercase 的方法属性。

Well, that's an easy fix. As you noted, I should have written c.upper. Delete, delete, delete, and now let's clear my screen, rerun Python of uppercase.py, Enter, hi exclamation point, and there we have the After version thereof. 
好吧，这是一个简单的修复。正如你指出的，我应该写 c.upper。删除，删除，删除，现在让我们清屏，重新运行 Python 的 uppercase.py，输入，hi 感叹号，然后我们就有了修改后的版本。

But even here, note that, in Python, I'm doing even more work than I need to. This is indeed how, in Python, I can enumerate all of the characters-- I can iterate over all of the characters in a string. There's no i's. There's no conditionals. Python will just, on every iteration, update the variable c to contain one letter, then the next, then the next, then the next. It just sort of works the way you would hope. 
但即使在这里，请注意，在 Python 中，我做了比需要更多的操作。这确实是 Python 中如何枚举所有字符——我可以遍历字符串中的所有字符。没有 i 变量。没有条件语句。Python 会在每次迭代中更新变量 c，使其包含一个字母，然后是下一个，然后是下一个，然后是下一个。它就像你希望的那样工作。

But, in Python 2, recall that you don't have individual characters anyway, so technically, I'm wasting my time by doing this one string of size 1 at a time again and again and again. I can tighten all of this up here, and I can just, for instance, do this. I can go ahead and print out, for instance, before.upper and just uppercase the whole thing all at once. And then I could technically get rid of the new line, but now I'm just wasting my time, too. 
但是，在 Python 2 中，你实际上并没有单独的字符，所以从技术上讲，我这样做是在浪费时间，一次又一次地一个一个字符地处理这个大小为 1 的字符串。我可以在这里把所有这些代码都压缩一下，比如，我可以直接这样做。我可以先打印出，比如，before.upper，一次性将整个字符串转换为大写。然后我理论上可以去掉换行符，但现在我又在浪费时间了。

Let me get rid of all of this. Let me go over here and let me output, for instance-- let me create a variable called After equals Before.upper. That's going to store in the After variable exactly what I want all at once without even using a for loop. And now I can print out as before an f string saying after colon space, space, and the value of the After variable. So this, if I run it again, Python of uppercase.py, Enter, hi in all lowercase, Enter, that too now works. 
让我把这些全去掉。让我到这边来，让我输出，比如——让我创建一个变量叫做 After 等于 Before.upper。这个 After 变量将一次性存储我想要的所有内容，甚至不用循环。现在我可以像之前一样打印出来，使用 f 字符串说 After：空格，空格，After 变量的值。所以，如果我现在再次运行它，运行 Python 的 uppercase.py，输入，hi 全部小写，输入，现在这也正常工作了。

And one final flourish-- strictly speaking, you can interpolate the value of what's returned from a function as follows. Instead of even bothering with a variable here, I could put a modest amount of code inside of the curly braces. And I say modest because if this gets too long, it's just going to confuse everyone, yourself included. But in this case here, I can run this one more time, type in hi in all lowercase, and that, too, now works because I'm formatting it as an f string. 
最后再点缀一下——严格来说，你可以这样插值函数返回的值。在这里甚至都不用变量，我可以在花括号里放一些简单的代码。我说简单是因为如果这太长了，只会让人困惑，包括你自己。但在这个例子中，我可以再运行一次，输入全部小写的 hi，现在这也行，因为我把它格式化为 f 字符串。

So, in short, I'm just getting more and more features at my disposal that I can now use to solve some of these same problems. So that there was a lot. Let's go ahead and take a 10-minute break with some Fruit by the Foot, and we'll be back with more complicated problems. 
简而言之，我现在可以使用的功能越来越多，可以用来解决一些相同的问题。所以有很多。让我们休息 10 分钟，吃点水果脚，然后回来解决更复杂的问题。

All right, we are back. So let's go and use some of this new syntax to actually make a meowing cat, albeit textually in Python. So back here in VS Code, I'm going to go ahead and create a program called meow.py. And let's first do it the super simple way. If we want the cat to meow three times, let's literally just do that in code. So print, quote unquote, meow. And we get the new line for free. And then I'm just going to copy paste this again and again. It's just going to give me three such lines, python of meow.py, Enter, and there we have it, a cat that meows three times. 
好的，我们回来了。那么让我们用一些新的语法来实际制作一只喵喵叫的猫，尽管是在 Python 中文字面上。所以在这里，我将在 VS Code 中创建一个名为 meow.py 的程序。我们先来简单点。如果我们想让猫喵喵叫三次，我们就可以直接在代码中这样做。所以打印“喵喵”。并且自动换行。然后我只需要复制粘贴即可。这将给我三条这样的行，python meow.py，回车，然后我们就有了，一只喵喵叫了三次的猫。

Of course, this is correct, but not well-designed because what should I obviously be using instead as a feature of any language, instead of three copy-pasted statements? Probably a loop of some sort. So let's borrow some of the inspiration from those previous slides. Let's go into meow.py and change this to maybe a while loop, initially. So how about i equals 0 then while i is less than 3, go ahead and print out meow. And then, let's go ahead and do i plus equals 1, which is the relatively quick way to do that in Python but not like C++. Python of meow.py, Enter-- so correct and better designed now. 
当然，这是正确的，但设计得并不好，因为显然我应该使用任何语言的功能来代替三次复制粘贴的语句？可能是一个循环。所以让我们从之前的幻灯片中汲取一些灵感。让我们进入 meow.py，并将其更改为可能是一个 while 循环。那么 i 等于 0，然后当 i 小于 3 时，就打印出“喵喵”。然后，让我们进行 i 加等于 1，这是在 Python 中相对快速的方式，但不像 C++。python meow.py，回车--现在正确且设计得更好了。

How else could I do that? Well, we saw earlier that I could do for i in 0, 1, 2, colon, and then I can do print quote unquote "meow." That too would work. If I rerun Python of meow.py, that works. But notice I'm not using i, and indeed, I'm not using 0 or 1 and 2. So, technically, I could do something like, quote unquote, "cat," "dog," "bird." I just need three things to enumerate over. And that too is going to give me three meows. 
如何才能做到呢？嗯，我们之前看到我可以对 0、1、2 进行迭代，然后我可以打印“meow。”这同样也可以工作。如果我重新运行 meow.py 的 Python，它也能工作。但请注意，我没有使用 i，实际上，我也没有使用 0、1 和 2。所以，技术上，我可以这样做，比如，“猫”、“狗”、“鸟。”我只需要三个东西来枚举。这也会给我三个“喵喵”。

So to be clear, the square brackets, much like in C, are giving me a list of values, but it's not an array. It's indeed a Python list. And as we'll see over time, a list in Python is nice versus an array in C because lists in Python can grow and shrink automatically for you. So not only are they linked lists of some sort, underneath the hood, you do not need to worry about resizing them anymore. 
为了明确起见，方括号，就像在 C 语言中一样，给我一个值的列表，但它不是一个数组。它确实是一个 Python 列表。随着时间的推移，我们会看到，与 C 语言中的数组相比，Python 列表很棒，因为 Python 列表可以自动增长和缩小。所以，它们不仅是某种链表，在底层，你再也不需要担心它们的调整大小了。

But, of course, as we saw before the break, we should probably just do this more dynamically. So for i in the range of three values and let Python generate those for me. If I rerun Python of meow.py, I still get three values. But here too, stylistically, recall, we said that you don't really need the name of the variable if you're just going to do something three times without ever touching that value. So we could just use an underscore by convention, which just kind of looks like there's no variable there, even though there in fact is. 
但是，当然，就像我们在中断之前看到的那样，我们可能应该更动态地做这件事。所以对于三个值的范围，让 Python 为我生成这些值。如果我重新运行 meow.py，我仍然得到三个值。但在这里，从风格上讲，回想一下，我们说过，如果你只是要重复三次而不去触摸那个值，你实际上不需要变量的名字。所以我们可以按照惯例使用下划线，这看起来就像没有变量一样，尽管实际上是有变量的。

But let's build on this and actually now introduce and really revisit the ability to define our own functions, which we've seen in Scratch. We've seen in C, and I technically, at the start of class, used it to implement my own spell checker. In dictionary.py, i used def, which stands for define, and that's how I defined four functions identically named to problem set 5. 
但让我们在此基础上实际引入并真正重新审视定义我们自己的函数的能力，这在 Scratch 中我们已经看到过。在 C 语言中我们也看到过，而且我在上课开始时实际上用它来实现了我自己的拼写检查器。在 dictionary.py 中，我使用了 def，代表定义，这就是我定义了四个同名函数到问题集 5 的方式。

Well, let me go ahead and do this and implement an abstraction for meowing, much like we did in Scratch, much like we did in C. Let me go ahead and define a function called meow whose purpose in life is simply for now to print out, quote unquote, meow. And now let me use that. Let me go ahead and do something like before. So for i in range of 3, go ahead and call meow, like this. I think that's going to get the job done. Python of meow.py, Enter, and indeed, it's still working exactly as I expected. 
好吧，让我先做这件事，实现一个类似于我们在 Scratch 和 C 语言中做过的喵喵声的抽象。让我先定义一个名为 meow 的函数，它的目的现在仅仅是打印出所谓的“喵喵”。现在让我使用它。让我像之前一样做。所以对于 3 的 range 中的 i，就调用 meow，就像这样。我想这应该能完成任务。Python 的 meow.py，回车，果然，它仍然像我所期望的那样工作。

But recall from our discussion of C, we generally stylistically encourage you to put your main code at the top of the file, if only because that's the entry point to the program. If you want to wrap your mind around the code in there, it makes sense to start with main instead of random functions like meow at the top of the file. So let me actually kind of practice what we preached in C. Let me move this meow function just to the bottom of my file so that it's sort of out of sight, out of mind because, now that it's implemented, it just exists. 
但回想一下我们关于 C 语言的讨论，我们在风格上通常鼓励你将主要代码放在文件顶部，仅因为那是程序的入口点。如果你想理解那里的代码，从 main 开始而不是从文件顶部的随机函数（比如 meow）开始是有意义的。所以，让我实际练习一下我们在 C 语言中宣扬的。让我把这个 meow 函数移动到文件底部，让它从视线中消失，从脑海中消失，因为现在它已经实现了，它只是存在。

Let me go back to VS Code and my terminal in VS Code, run Python of meow again, and hit Enter. And there's one of those tracebacks, a different one this time. This time, it's a name error instead of an attribute error. But where did I go wrong? Apparently, M-E-O-W no longer exists by nature of having moved it from top to bottom. So, intuitively, even if you're new to Python, why might that be? Yeah? 
让我回到 VS Code 和我的 VS Code 终端，再次运行 Python 的 meow，然后按 Enter 键。这次出现了一个 traceback，这次是名称错误而不是属性错误。但我错在哪里呢？显然，由于我把它从顶部移到底部，M-E-O-W 自然就不存在了。那么，即使你是 Python 的新手，为什么可能会这样呢？是的？

AUDIENCE: Because you need to define before you call it. 
观众：因为你在调用之前需要定义它。

DAVID J. MALAN: Exactly. I need to define it before I call it, very similar to C, whereby at least in C, we had that little trick of just copy pasting the prototype of the function, just a borrowing its very first line. Python actually doesn't use that mechanism. Instead, Python has a different convention instead. Technically, in Python, you do not need a main function. Clearly, from all of the programs I've written, it just works without a main function. 
DAVID J. MALAN: 正确。我需要在调用之前定义它，这与 C 语言非常相似，至少在 C 语言中，我们有一个小技巧，就是直接复制粘贴函数原型，只是借用它的第一行。实际上，Python 并没有使用这种机制。相反，Python 有一个不同的约定。从技术上讲，在 Python 中，你不需要 main 函数。显然，从我写的所有程序来看，没有 main 函数也能正常工作。

But if you get yourself into a situation where you're defining your own functions, but the order in which you define them and then use them clearly matters, you might as well go ahead and implement a main function after all. 
但如果你发现自己处于一个需要定义自己的函数，但定义和使用它们的顺序显然很重要的情境中，那么你不妨最终还是实现一个 main 函数。

And the convention would be to do this, literally define with the def keyword a function called main that doesn't need to take any arguments. And then, inside of that main function, put your actual code. Indentation in Python matters, and so I've hit Tab to indent everything all at once. And now I have a main function. So it would seem that maybe now the problem is solved by just introducing main. So Python of meow.py, Enter-- it's solved in the sense that I'm not seeing an error message anymore, but explain to me, intuitively, why I'm not seeing anything at all? Yeah? 
按照约定，我们使用 def 关键字直接定义一个名为 main 的函数，这个函数不需要任何参数。然后在 main 函数内部编写实际的代码。在 Python 中，缩进很重要，所以我按下了 Tab 键一次性缩进所有内容。现在，我有一个 main 函数。所以，看起来问题可能只是通过引入 main 就解决了。所以，运行 Python meow.py，回车--从错误信息消失的角度来看，问题解决了，但请从直观上解释一下，为什么我什么都没有看到？是的？

AUDIENCE: You did not call main. 
AUDIENCE: 您没有调用 main。

DAVID J. MALAN: I didn't call main. So it's sort of like we're taking a step forward but then another step backwards here in the sense that Python doesn't come with support for a main function by default. So if you invent it yourself, the onus is on you to call that function. So this is going to look a little stupid. But the convention in Python is, indeed, at the very bottom of your program, if it's contained in a single file, is literally call main at the very bottom. 
DAVID J. MALAN: 我没有调用 main。所以这就像我们向前迈了一步，然后又退了一步。因为在 Python 中，默认情况下并没有对 main 函数的支持。所以如果你自己发明了它，那么调用这个函数的责任就在你身上。这看起来有点愚蠢。但 Python 的惯例是，如果你的程序只包含在一个文件中，那么在程序的最底部，确实应该调用 main。

So now I'm going to go back to VS Code. I'm going to rerun meow.py, and now I get back the functionality, but I don't get an error message either. Why? Well, in this case, on line 1, I'm defining the main function as follows. On line 6, I'm defining the meow function as follows. I am not using either of those functions in actuality until line 10 calls main, which then calls meow. 
所以现在我将回到 VS Code。我将重新运行 meow.py，现在我得到了功能，但也没有错误信息。为什么？在这种情况下，在第 1 行，我这样定义 main 函数。在第 6 行，我这样定义 meow 函数。实际上，我直到第 10 行调用 main 函数时才使用这两个函数，而 main 函数又调用了 meow 函数。

So I fixed my sort of order of operations, so it's fine for main to be defined above it so long as I don't actually call meow until I've defined it as well. So this defines main, defines meow, and then actually calls main. So this is a nice way in Python to avoid what could be a very complicated design problem by just defining our own functions, including one called main. 
因此我修复了我的操作顺序，所以只要我不在定义它之前调用 meow，就可以在 main 定义在它上面。所以这里定义了 main，定义了 meow，然后实际上调用了 main。这是 Python 中避免可能非常复杂的设计问题的一种很好的方法，只需定义我们自己的函数，包括一个名为 main 的函数。

Strictly speaking, it doesn't even have to be called main, but it would be frowned upon as a matter of design, as a matter of style, to call it anything other than main, even though that has no special meaning beyond convention. Well, let's make one tweak here, just as in C, just as in Scratch, it would be nice if meow actually took an argument, which is the number of times I want to meow. So let's assume that that functionality exists by calling meow of 3 as the input to that function. 
严格来说，它甚至不需要命名为 main，但在设计风格上，人们会不赞成将其命名为除 main 之外的其他名称，尽管这并没有超越约定的特殊含义。好吧，让我们在这里做一个小调整，就像在 C 语言中，就像在 Scratch 中一样，如果 meow 能接受一个参数，即我想要叫几次，那就好了。所以让我们假设这个功能存在，通过将 3 作为函数的输入来调用 meow。

But how do I now change the definition of meow? Well, just like in C, you put inside of the parentheses when defining the function a comma separated list of one or more of 0 or more parameters, and I can call it anything I want. I'll call it n for number of times. I don't have to specify int though because we know that already. 
但我如何现在改变 meow 的定义呢？就像在 C 语言中一样，你只需要在定义函数时在括号内放置一个逗号分隔的参数列表，可以命名为任何你想要的。我会叫它 n，代表次数。我们不需要指定 int，因为我们已经知道了。

But in, now, this loop, I can do for i in range of n-- i doesn't have to be 3. It can be n as a variable's value. Then indent this line so that it indeed iterates n times, printing out "meow," in this case. If I run it again as Python of meow.py, Enter, now I see meow, meow meow. But this is arguably the best designed of my versions thus far because it is indeed parameterizing how many times I'm meowing. 
但在这个循环中，我现在可以这样做：for i in range(n) -- i 不一定必须是 3，它可以是一个变量的值。然后缩进这一行，使其确实迭代 n 次，在这种情况下打印出 "喵喵"。如果我再次运行它，作为 Python 的 meow.py，按下 Enter，现在我看到了喵喵喵喵。但这是迄今为止我设计的版本中最好的，因为它确实参数化了喵喵的次数。

Now as an aside, especially those of you who might have used Python before or might go on and look at tutorials and such for Python itself as a language, technically the conventional way to call main is with this weird syntax. If __name__ equals equals quote unquote "__main__" colon Tab, we don't bother doing this in most of our class examples because it doesn't actually solve a problem that we ourselves will encounter, and it's just really hard to remember and confusing to read. 
顺便说一句，尤其是那些之前可能使用过 Python 或者可能会去查看 Python 语言教程的你们，技术上调用 main 的传统方式是这样的奇怪语法。如果 __name__ 等于双引号 "main" 双引号冒号制表符，我们大多数类示例中都不这么做，因为我们自己实际上不会遇到这个问题，而且这太难记了，读起来也很混乱。

But you will see this in the wild, in the real world. And long story short, this syntax of line 10 being added solves problems where you're implementing not your own program per se, but your own library, your own library that may very well have its own main function. But for now, I'm going to wave my hand and make that go away and keep it simple because this is the juicy idea for now. 
但你会在现实世界中看到这一点。简而言之，第 10 行的这种语法添加是为了解决你在实现不是你自己的程序本身，而是你自己的库时的问题，这个库可能非常有自己的主函数。但就目前而言，我将挥挥手让这个问题消失，保持简单，因为现在这个想法才是关键。

As an aside, there's other ways to have loops in Python that's worth noting. So, for instance, in Scratch we had this forever block saying meow again and again and again without ever stopping. In C, maybe one way to do this was like this, like while true because true is always true. So this condition is always true. So it's just going to print endlessly. In Python, the syntax is roughly the same, while True, but capital T and capital F for False, this too would achieve the same result. 
顺便说一下，Python 中还有其他值得注意的循环方式。例如，在 Scratch 中，我们有一个“永远”块，它会不断地重复“喵喵喵”而不停歇。在 C 语言中，可能有一种实现方式是这样的，就像 while true 一样，因为 true 总是 true。所以这个条件总是 true。所以它将无限地打印。在 Python 中，语法大致相同，while True，但 True 和 False 的首字母要大写，这也会达到相同的效果。

And so just to demonstrate, though, a very common mistake might be to have some kind of infinite loop in your code that might happen just the same in Python. So if I go back to meow.py, and just for kicks, I simplify this to literally just while capital True colon print quote unquote "meow," you could get yourself into some trouble here by running that code, and it just seems to meow endlessly. How do I get out of this situation besides reloading my browser and closing the terminal? What's the more elegant way. 
因此，为了演示，一个非常常见的错误可能是在你的代码中有一个无限循环，这在 Python 中同样可能发生。所以如果我回到 meow.py，并且只是为了好玩，我将这个简化为实际上只是 while True: print("meow")，运行这段代码可能会让你陷入麻烦，因为它似乎会无限地“喵喵”叫。除了重新加载浏览器和关闭终端之外，我该如何从这个情况中解脱出来？有什么更优雅的方法吗？

AUDIENCE: [INAUDIBLE]   观众：[听不清]

DAVID J. MALAN: Yeah, Control-C. So Control-C for interrupt will cancel what's going on there, just like in C. This, though, does not mean there's an error in your code. C did not do this. Python does show a keyboard interrupt error, if you will, but that's because you literally interrupted the program while it was running. This doesn't mean there's a problem in your code. You've simply interrupted it because you lost control over the thing. 
大卫·J·马尔安：是的，按 Ctrl+C。按 Ctrl+C 用于中断，就像在 C 语言中一样。但这并不意味着你的代码有错误。C 语言并没有这样做。Python 会显示一个键盘中断错误，如果你愿意的话，这是因为你实际上在程序运行时中断了它。这并不意味着你的代码有问题。你只是因为失去了控制而中断了它。

So what are some other issues we can perhaps now revisit together? So in the world of C, recall that we ran into issues of truncation, whereby if we did integer math, like 1 divided by 3, that would give me, ideally in the real world, 0.3333333 forever. But it ended up coming out as 0 in C as well. 
那么，我们还可以一起重新审视哪些其他问题呢？在 C 语言的世界里，我们曾经遇到过截断问题，如果我们进行整数运算，比如 1 除以 3，在现实世界中，理想情况下应该是 0.3333333……无限循环。但在 C 语言中，结果却变成了 0。

So let's see what happens in the world of Python now. And I'm going to move away from showing left and right C in Python for now. Let's go ahead and just focus on the Python code. So let's try this. Let me go and create a new program after closing me out up high called, say, calculator.py again. Let me throw away the relatively simple code earlier that simply added two numbers together, and let's do some division now. So let's do x equals int, passing in the input, asking for an x-value, like this. Let's do y equals int input, passing in a y prompt like that. Then let's do a variable called z equals x divided by y, and then let's print out z. 
现在让我们看看 Python 世界会发生什么。我现在将不再在 Python 中展示左右 C 语言的代码。让我们现在就专注于 Python 代码。让我们试试这个。让我创建一个新的程序，叫做 calculator.py，在关闭当前程序后。让我扔掉之前相对简单的代码，那个只是将两个数字相加的代码，现在让我们来做除法。让我们做 x 等于 int，传入输入，请求 x 值，就像这样。让我们做 y 等于 int input，传入 y 提示，就像这样。然后我们做一个变量 z 等于 x 除以 y，然后打印出 z。

So this is actually very similar to something we did weeks ago in C when we first tripped over this issue. Let me run Python of calculator.py, type in 1 for x, 3 for y, and it would seem as though truncation is not an issue in Python. By simply using the slash symbol for division. It turns out there's another symbol you can use in Python if you want to get back truncation. You can do slash slash, which is not a comment. It actually means do division, like the way C used to do it. But in Python, probably for the benefit of all of us globally, division works as you would expect, and you get back, in fact, this here value instead. 
所以这实际上与我们几周前在 C 语言中遇到的问题非常相似。让我运行一下 calculator.py 的 Python 版本，输入 1 作为 x，3 作为 y，似乎在 Python 中截断并不是一个问题。只需使用斜杠符号进行除法。实际上，Python 中还有一个符号可以使用，如果你想得到截断。你可以使用两个斜杠，这并不是注释。它实际上意味着进行除法，就像 C 语言以前做的那样。但在 Python 中，可能为了我们全球所有人的利益，除法工作方式如你所期望，你实际上得到这个值。

What about another issue we saw in C? That a floating point imprecision, whereby even though something's supposed to be 0.3333333, infinitely many times, it seemed, remember, like grade school was lying to us because there were weird numbers in even a fraction like one third. 
那么在 C 语言中我们遇到的另一个问题是什么？那就是浮点数的不精确性，尽管某物应该无限次地是 0.3333333，但就像我们记得的那样，小学时老师可能是在骗我们，因为甚至在分数如三分之一中也有奇怪的数量。

Well, let's try this out in Python. Let's go back to my here calculator, and I only need to make a slight tweak here, for instance, though, the syntax is going to be a little weird here. Instead of just printing out z to some default number of significant digits, let's actually format the string as follows. And this is not syntax you'll need frequently, but in Python, you can use an f string by doing f quote unquote something. 
好吧，让我们在 Python 中试试这个。让我们回到我的这里计算器，我只需要在这里稍作修改，比如说，这里的语法会有一点奇怪。不是简单地打印出 z 到默认的有效数字位数，而是实际上按照以下方式格式化字符串。这不是你经常需要的语法，但在 Python 中，你可以通过这样做 f 引号“unquote”来使用 f 字符串。

And inside the double quotes this time, instead of just doing z to print out and interpolate the value of z inside of those curly braces, let's specify that, yes, I Want the value of z, but I want to print it to, like, 50 decimal places as a floating point value. I have to google this syntax all the time to remember what it is, but this is saying exactly that. Show me 50 significant digits in this here number. 
这次在双引号内，不是简单地打印出 z 并插值 z 的值在括号内，而是指定，是的，我想打印 z 的值，但我希望将其打印为 50 位小数的浮点数。我不得不经常在谷歌上搜索这个语法来记住它是什么，但这正是它的意思。在这个数字中显示 50 位有效数字。

So let's go back to my terminal, Python of calculator.py, Enter, 1, 3 should get 0.33 repeating forever. But, of course, we do not. So, unfortunately, Python does not solve all of our problems. Floating point in precision is still an issue. Does that mean you shouldn't use it for scientific computing, for financial computing and the like? No, there are libraries that you can use, third-party code that sort of addresses this kind of concern. But you still need to be mindful of the fact that these problems still exist, and either you or someone else still needs to handle something like this. 
好吧，让我们回到我的终端，输入 calculator.py，然后按回车，输入 1 和 3 应该得到 0.33 无限循环。但是，当然不是这样。不幸的是，Python 并不能解决我们所有的问题。浮点数的精度问题仍然存在。这意味着你不应该用它来进行科学计算、金融计算等等吗？不，你可以使用一些库，第三方代码可以解决这类问题。但你需要意识到这些问题仍然存在，你可能或其他人仍然需要处理类似的问题。

What about something like integer overflow? Well, wonderfully in Python, integer overflow is not a thing. Recall that in C, if you use an int of 32 bits, it's eventually going to overflow and go negative or go back to 0 once you count beyond, 2 billion or 4 billion, depending on if you're doing negatives or not. You could use a long in C, which gave you 64 bits, which means it's still going to overflow, but probably after we're all dead because the number is going to count up much, much, much higher. 
那关于整数溢出的问题呢？在 Python 中，整数溢出并不是一个问题。回想一下，在 C 语言中，如果你使用 32 位的 int，一旦计数超过 20 亿或 40 亿，它就会溢出并变成负数或回到 0，这取决于你是否在计算负数。你可以在 C 语言中使用 long，它提供了 64 位，这意味着它仍然会溢出，但可能在我们所有人都死了之后，因为数字会计数得更高。

Fortunately, in Python, you don't have to worry about int. You don't have to worry about long. It will just allocate more and more bits for you automatically, secretly, underneath the hood so you can just iterate from 0 on up toward infinity, and the program will run theoretically forever without ever actually overflowing the int. So at least integer overflow-- not a problem. 
幸运的是，在 Python 中，你不必担心 int 类型。你也不必担心 long 类型。它将自动为你分配越来越多的位，秘密地在幕后进行，这样你就可以从 0 开始迭代，一直向上到无穷大，程序理论上可以永远运行而不会真正溢出 int。所以至少整数溢出——不是问题。

But there are problems that might still happen. And let's explore how there are new mechanisms in Python and languages like it that we didn't have in C. So, in particular, let's introduce something called exceptions, which is sort of a concept and a feature that's worth understanding so that you'll encounter it not only in Python but also likely in the real world. And let's do it as follows. Let me go back to VS Code after closing my calculator and let me go ahead and open up a new program called integer.py just to play around with integers. 
但仍然可能发生问题。让我们探讨 Python 以及类似语言中新的机制，这些机制我们在 C 语言中没有。特别是，让我们介绍一种叫做异常的概念和特性，这是一个值得理解的概念，这样你不仅会在 Python 中遇到它，而且在现实世界中也很可能遇到。让我们这样做。让我在关闭计算器后回到 VS Code，打开一个新的程序，叫做 integer.py，来玩一下整数。

And let me go ahead and do this. Let me first prompt the user for a number n, set it equal to the return value of input by just asking them in between quotes a prompt of input. Like, I really just want them to type a number, but maybe they won't. So let's see what happens. There are ways now to detect if the human has typed in not only a string but a numeric string, like 1 or 3 or something else. I can simply use a conditional in Python pretty easily. 
让我先去做这件事。首先，我需要提示用户输入一个数字 n，将其设置为 input 函数的返回值，通过在引号中询问他们输入提示。就像我真的只想让他们输入一个数字，但他们可能不会。所以让我们看看会发生什么。现在有方法可以检测人类是否输入了不仅仅是字符串，而且是数字字符串，比如 1 或 3 或其他。我可以在 Python 中非常容易地使用一个条件。

In C, I would have to do this pretty much character by character. By character. In Python, I can do it the whole string at once. If n.isnumeric, open paren, close paren, thereby using a method that comes with all strings in Python that will just tell me true or false, this whole thing is numeric or not, then I can go ahead and print out, for instance, integer, just concluding that this here thing is an integer. Else, if it is not all numeric, I'm going to go ahead and print out "not integer," quote unquote. 
在 C 语言中，我必须一个字符一个字符地这样做。一个字符一个字符地。在 Python 中，我可以一次性处理整个字符串。如果 n.isnumeric，括号内，括号外，使用 Python 中所有字符串都有的方法，告诉我这个整体是数字还是不是，然后我可以继续打印出，比如整数，这样就得出这里的这个是整数的结论。否则，如果它不是全部数字，我将打印出“not integer”，“所谓”。

Let's try this out. Let me run Python of integer.py. I'll type in one. That's an integer. Let's run it again, type in 3, that's an integer. Let's run it again, type in cat, that is not an integer. So it seems to work at a glance. 
我们来试试。让我运行 Python 的 integer.py。我会输入一个。这是一个整数。我们再试一次，输入 3，这是一个整数。再试一次，输入 cat，这不是一个整数。所以看起来它似乎工作得很好。

But how else might we go about doing this, especially if-- so that we don't have to litter our code with all of these darn conditionals every time I'm just trying to get an int? I don't want to resort to the CS50 library. Ideally, I don't want training wheels. But I want to do this the Python way, and there's a word for that-- the "Pythonic" way. So that too is a term of art, which means there might be different ways to do it, but do it the way where a majority of people out there would probably agree with you Pythonically. 
但是我们如何才能做到这一点，尤其是在我们不想每次只是尝试获取一个整数时在代码中充斥着所有这些讨厌的条件语句的情况下？我不想求助于 CS50 库。理想情况下，我不想使用训练轮。但我想用 Python 的方式来做这件事，这有一个词可以形容——那就是“Pythonic”的方式。这也是一个术语，这意味着可能会有不同的方法来做这件事，但以大多数人可能会同意的 Python 方式来做这件事。

So let's do this. Instead of bothering with the conditional, because this is kind of annoying that one line of code really becomes four all of a sudden, let's just go ahead and proactively convert what the human types in to an int, as I did before, to fix the 12 problem. Let's run Python of integer.py, Enter. Let's do 1, Enter-- seems to not make any errors. Nothing bad happened. Let's type in 3. That there works, too. 
好吧，让我们这么做。不用去管这个条件语句，因为这一行代码突然变成了四行，有点烦人，我们就主动将人类输入的内容转换为整数，就像我之前做的那样，来解决 12 的问题。让我们运行 Python 的 integer.py，输入。让我们输入 1，输入——看起来没有出错。没有发生任何坏事。让我们输入 3。这也行得通。

Let's type in cat, and that throws one of those tracebacks, where the traceback itself is not the error, but it's diagnostic information that's trying to help me figure out where I screwed up. Apparently, I screwed up somewhere in this whole thing, and this is a little cryptic, but this is a value error, something-- I screwed up a value here. Invalid literal for int with base 10 "cat." So that's a very verbose way of saying, by default, the int function assumes base 10, a.k.a. decimal, and it doesn't understand cat, so it's just not working on cat. 
让我们输入“cat”，然后会出现那种跟踪异常，跟踪异常本身并不是错误，而是试图帮助我找出我出错的地方。显然，我在某个地方出了问题，这有点晦涩，但这是一个值错误，我在这里弄错了值。对于以 10 为基的 int 类型，“cat”是一个无效的文本。所以这是一种非常冗长的方式来说明，默认情况下，int 函数假设基数为 10，也就是十进制，它不理解“cat”，所以它根本无法在“cat”上工作。

So how do I solve this? Well, notice what's happening here. Simply trying to convert cat to an integer is not just returning some special value, like 0 or negative 1. Like, it's literally terminating my whole program. And this is different from C. Recall that, in C, the only way you could signal errors that we've seen is that you have to return a sentinel value, like 0 or negative 1 or positive 1 or null or whatever. You have to know in advance what special value is going to come back. But there's a problem with integers in particular. 
那我该如何解决这个问题呢？注意这里发生了什么。仅仅尝试将“cat”转换为整数，并不是返回一些特殊值，比如 0 或-1。就像，它实际上终止了我的整个程序。这与 C 语言不同。回想一下，在 C 语言中，我们只能通过返回一个预知的特殊值来表示错误，比如 0 或-1 或+1 或 null 等。你必须事先知道将返回什么特殊值。但是，对于整数来说，有一个问题。

Suppose that the int function was defined in its documentation as printing out-- as returning 0 if anything goes wrong. You could check for 0. So if n equals equals 0, then you could say print not integer because, according to the documentation I'm pretending exists, that is an invalid value. Of course, where does this get me into trouble if I run Python of integer.py? Type in 1. We're good. Type in 2, we're good. 
假设 int 函数在其文档中定义为打印输出——如果出现任何错误则返回 0。你可以检查返回值是否为 0。所以如果 n 等于 0，那么你可以打印“不是整数”，因为根据我假装存在的文档，这是一个无效值。当然，如果我运行 Python 的 integer.py，这会让我陷入什么麻烦呢？输入 1，没问题。输入 2，也没问题。

Type in 0-- 0 is not an integer, but I'm pretty sure it is. So there's a problem whereby if you're relying on return values to signal that something went wrong, you have to sacrifice a potentially valid value. And that's fine, but you're going to have to pick a number. It's got to return 0, negative 1, positive 1, 4 billion, negative 4 billion-- like, you've got to pick a lane. And that's unfortunate because you're sacrificing some value unnecessarily. 
输入 0——0 不是一个整数，但我确信它是。所以如果你依赖于返回值来表示出错，你必须牺牲一个可能有效的值。这可以，但你必须选择一个数字。它必须返回 0，-1，+1，40 亿，-40 亿——就像，你必须选择一个车道。这很不幸，因为你正在不必要地牺牲一些值。

So what Python does and what other languages do is instead of returning some sentinel value that means something went wrong, they just throw up their hands, so to speak. They throw an exception. And an exception, by default, just terminates the program because something unexpected happens, something exceptional where, in this case, exceptional is a bad thing. Something exceptional happened. 
所以 Python 和其他语言的做法不同，它们不是返回一个表示出错的哨兵值，而是举起双手，换句话说，它们抛出异常。默认情况下，异常会导致程序终止，因为发生了意外的事情，发生了异常，在这里，异常是一个坏事情。发生了异常的事情。

So how can we handle this? How can we actually detect that something has gone wrong? Well, it turns out-- this is sort of encouraging-- you can try to do something instead in Python as opposed to just blindly doing it. So if I go back into VS Code here and I try to do that, let's do the following. Ideally, I want the end result to look like this-- print integer if this thing works. And so, to be clear, let me run this once more. Python of integer.py, 1 is an integer, 2 is an integer, cat-- not an integer. But I'd like to see not integer, and not some crazy message on the screen. 
那我们该如何处理这种情况呢？我们如何真正地检测到出错了呢？实际上，这有点令人鼓舞——在 Python 中，你可以尝试做一些事情，而不是盲目地做。所以，如果我回到 VS Code 这里，尝试做这件事，让我们这样做。理想情况下，我希望最终结果看起来像这样——如果这个功能正常，就打印整数。为了清楚起见，让我再运行一次。Python of integer.py，1 是一个整数，2 是一个整数，cat——不是一个整数。但我想看到的是“不是整数”，而不是屏幕上的一些疯狂信息。

So how can I fix this? Well, let's do this instead. Please try to do all of this, except if there's a value error, as I know can happen because I just experienced it, then go ahead and print out "not integer," quote unquote. So let me just keep my grammar the same. Python of integer.py, Enter-- 1 works. Python of integer.py-- 3 works Python of integer.py-- cat doesn't work per se, but it doesn't throw an error message anymore and that scary traceback. I'm somehow catching the exception or handling the exception, so to speak. 
那么，我该如何解决这个问题呢？嗯，让我们换一种方法来做。请尽量完成所有这些操作，除非出现值错误，正如我所知，这种情况可能发生，因为我刚刚就遇到了，那么就打印出“不是整数”这句话。让我保持语法不变。Python of integer.py，输入-- 1 可以工作。Python of integer.py-- 3 可以工作 Python of integer.py-- cat 不行，但也不再抛出错误信息，也没有那么可怕的错误跟踪信息。我似乎在捕获异常或处理异常，换句话说。

Now, as an aside, the slightly better way to do this would also be as follows. Generally speaking, it's considered a bit lazy and bad design to put more lines of code in a try statement than you strictly need because imagine a program has 30 lines of code. Maybe it's your whole Pset problem, and you know you're occasionally getting those traceback errors on the screen. 
现在，顺便说一下，稍微好一点的方法是这样的。一般来说，在 try 语句中放入比严格需要的更多代码行被认为是一种懒惰和不好的设计，因为想象一下，一个程序有 30 行代码。也许它是你的整个 Pset 问题，你知道你偶尔会在屏幕上看到那些错误跟踪信息。

A bad student, for instance, would just put everything in the try block and literally just try to do your homework. And if there's an exception, then you just catch it at the very bottom. That's frowned upon because there's just bad design. When you're trying to do something, you should really only wrap the one or more lines that will actually raise an exception inside of it. So, technically, print is not going to fail. You can't screw up print when you're just printing out, quote unquote, "integer." 
一个差劲的学生，比如，会把所有东西都放在 try 块里，然后字面地尝试做你的作业。如果有异常，你就在最底部捕获它。这是不被提倡的，因为设计得很糟糕。当你试图做某事时，你应该只将实际会抛出异常的一行或多行代码包裹在 try 块中。所以，技术上讲，print 是不会失败的。当你只是打印所谓的“整数”时，你不可能搞砸 print。

So, weirdly, the try accept statement in Python also supports an else whereby if there's not an exception, you can then do this statement instead. It's a little weird because we've only seen elses and conditionals. But you'll see this in the real world. This, though, would achieve the exact same thing. 
所以，奇怪的是，Python 中的 try-except 语句也支持 else 子句，如果没有异常发生，你可以执行这个语句。这有点奇怪，因为我们只见过 else 和条件语句。但你在现实生活中会看到这种情况。不过，这会达到完全相同的效果。

But it's a little better because now the only line of code I'm wrapping is the one that can actually raise this exception in the first place. So Python of integer.py-- 1 works. 3 works. Wait a minute. Oh, wait, that's completely logical-- it does not work. This is supposed to say integer if it is not, in fact, an exception-- sorry, user error. Python of integer.py-- 1 works. 3 works. Cat is caught but therefore not an integer in this case. 
但这稍微好一些，因为现在我只包裹了真正可能引发这个异常的那一行代码。所以 Python integer.py-- 1 能工作。3 也能工作。等等，等等，这是完全合理的——它不工作。这应该显示为“integer”，如果它实际上不是异常的话——抱歉，用户错误。Python integer.py-- 1 能工作。3 也能工作。猫被捕获了，但在这个情况下它不是整数。

So long story short, why do we introduce this? Well, one, these exceptions are actually omnipresent in higher level languages, and this is the way that many languages actually raise exceptions to signal that error has happened as opposed to reserving arbitrarily some special return value that you must check for. But you need to now try to do certain things, except if errors happen, in which case you can catch them, so to speak, in this way. 
简而言之，我们为什么要引入这个？嗯，一方面，这些异常在高级语言中实际上是普遍存在的，这就是许多语言实际上如何通过引发异常来表示错误发生，而不是保留一些任意特殊的返回值，你必须检查这个返回值。但是，你现在需要尝试做一些事情，除非发生错误，否则你可以这样“捕获”错误。

As an aside, how does CS50's get_int function in our library work? We essentially are using try and accept inside of a loop that just keeps prompting and prompting and prompting the user for an actual integer until you oblige, and then we return that value in CS50's Python version of get_int. So we're using the same fundamental in there. 
作为旁白，CS50 的 get_int 函数在我们的库中是如何工作的呢？我们实际上是在一个循环中使用 try 和 accept，这个循环会不断地提示用户输入一个实际的整数，直到你同意为止，然后我们在 CS50 的 Python 版本中返回这个值。所以我们在这里使用的是同样的基本方法。

Let's try now a few familiar things here on stage in homage to the Python crawling on Mario's bricks here. So recall that, a few weeks ago, we played around with something super simple like this in C, which wasn't syntactically as simple, but the idea was to print out a column of for instance, three bricks. 
现在，让我们在舞台上尝试一些熟悉的东西，以向 Python 在马里奥的砖块上爬行致敬。回想一下，几周前我们在 C 语言中玩了一个非常简单的例子，虽然它的语法并不简单，但想法是打印出一列，比如三块砖。

How might I go about doing this in code? Well, let's see. Let me open up a new file called mario.py today. And let's just do it the simplest way possible. If I want to print three bricks, I could do for i in range of 3, and then I could print out a single hash mark to represent exactly that. I'm going to get the new line for free because that's the automatic default behavior for print. So if I run this, I get something that's a little underwhelming but pretty close to the spirit of what I just did here on the screen. What if, though, I want to prompt the user for the height of this thing, just as we did in problem set 1 with the Mario problems? How can I make sure the user actually gives me a number I want? 
我该如何在代码中实现这个功能呢？好吧，让我们看看。今天让我打开一个名为 mario.py 的新文件。我们就用最简单的方法来做吧。如果我想打印三个砖块，我可以使用 for i in range(3) 来实现，然后我可以打印出一个井号来代表这个。由于 print 函数默认会换行，所以我将免费获得一个换行符。如果我运行这个程序，我会得到一些东西，虽然有点令人失望，但已经很接近我在屏幕上所做的了。那么，如果我想让用户输入这个高度，就像我们在问题集 1 中的马里奥问题中做的那样，我该如何确保用户输入的是我想要的数字呢？

Well, let's go back to VS Code here, and just so that I don't have to implement all the try-except stuff myself, let's go ahead and, from CS50 library, import the get_int function that I've claimed exists, and then let's do this-- while True. It turns out, in Python especially, it's actually pretty common to deliberately induce infinite loops if only because Python does not have do-while loops. 
好吧，让我们回到 VS Code 这里，为了避免自己实现所有的 try-except 代码，让我们从 CS50 库中导入 get_int 函数，这个函数我声称是存在的，然后我们来做这个-- while True。在 Python 中，特别是，故意引入无限循环实际上是很常见的，因为 Python 没有 do-while 循环。

Recall that do-while loops and C were super useful because they guarantee that you do something while a condition is still true. And that allowed us to get user input at least once and maybe again and again and again and again. Python does not have a do-while. But you can implement the idea of it by just saying start an infinite loop that I'm going to plan to break out of when I am ready. And I can do something like this-- n equals get_int, prompting the user for height here as a prompt. 
回想一下，do-while 循环和 C 语言非常实用，因为它们可以保证在条件仍然为真时执行某些操作。这使得我们至少可以获取一次用户输入，也许还可以一次又一次地获取。Python 没有 do-while 循环。但是，你可以通过启动一个无限循环来实现这个想法，当我准备好时再跳出循环。例如，我可以这样做-- n 等于 get_int，提示用户输入高度作为提示。

Then, if n is what I want it to be, a value greater than 0 as in problem set 1, go ahead and break out of this loop. So even though I don't have a do-while, I can certainly deliberately get myself into an infinite loop and break out of it when I'm logically ready to do so. And now, here, I can do for i in range of n, which is just going to iterate from 0 on up to that value and then print out a hash mark as follows. Let me go ahead and run Python of mario.py, type in a height of 3, and it still works. Type in a height of, say, 5-- it too works by iterating five times instead of three. 
然后，如果 n 是我想要的值，即大于 0，就像问题集 1 中那样，就跳出这个循环。尽管我没有 do-while 循环，但我当然可以故意进入一个无限循环，并在逻辑上准备好时跳出它。现在，在这里，我可以使用 for i in range(n)来迭代，这将从 0 迭代到那个值，然后打印出井号，如下所示。让我先运行一下 Python 的 mario.py，输入高度为 3，它仍然可以工作。输入高度为，比如说，5--它也可以工作，因为它会迭代五次而不是三次。

As an aside, what are some modifications that might be germane here? Well, if I want to import the entirety of CS50 library, I can indeed, as I said earlier, just import the library itself. But notice what happens now. Python of mario.py, Enter-- a traceback, specifically a name error, get_int is not defined. 
作为旁白，这里可能有哪些修改是相关的？嗯，如果我想导入整个 CS50 库，我确实可以，就像我之前说的，只需导入库本身。但请注意现在发生了什么。在 mario.py 中导入 Python，输入--一个跟踪回溯，具体是一个命名错误，get_int 未定义。

This is because Python actually solves a problem that C does not. In C, we didn't actually encounter this because our programs haven't been too big. But in C, if you include this library and this one and this one and this one, you will get into trouble if two people out there have named a function the same thing. 
这是因为 Python 实际上解决了 C 语言没有解决的问题。在 C 语言中，我们没有遇到这个问题，因为我们的程序还不够大。但在 C 语言中，如果你包含了这些库，如果两个人都给一个函数取了相同的名字，你就会遇到麻烦。

If they've typed up something the same thing-- there's no notion of scope when it comes to importing libraries in C. You will get name collisions, and the solution is just don't do that. Don't use that library that conflicts with one you're using. Humans realized, eventually, this is probably not the best design, so they introduced the notion of namespacing, whereby you can scope certain symbols to specific files in effect. 
如果他们输入了相同的内容——在 C 语言中导入库时没有作用域的概念。你会遇到名称冲突，解决方案就是不要这样做。不要使用与你正在使用的库冲突的库。人类最终意识到，这种设计可能不是最好的，所以他们引入了命名空间的概念，通过这种方式可以将某些符号的作用域限制在特定的文件中。

And so there is a solution to this. If you import the entirety of CS50, that's fine. But you have to say that you want the function called get_int that's inside of the CS50 library. So if I do cs50.get_int and rerun this, now I no longer see that error, and I'm on my way again with the code. 
因此，这个问题是有解决方案的。如果你导入整个 CS50 库，那没问题。但你必须说明你想要 CS50 库中的 get_int 函数。所以，如果我这样做 cs50.get_int 并重新运行这个程序，现在我就不再看到那个错误了，我继续编写代码。

And this just allows me to keep all of my get underscore something functions scoped to the CS50 symbol as opposed to importing them all into the top-level namespace, where they're just essentially global instead. Questions about this-- the new ideas here really being now infinitely looping, deliberately, until you're ready to break out. No-- seeing none. 
这只是允许我将所有的 get underscore something 函数限定在 CS50 符号的作用域内，而不是将它们全部导入到顶层命名空间，在那里它们基本上是全局的。对此有什么疑问——这里的新想法现在实际上是无限制循环，直到你准备好跳出。没有——看到什么。

All right, how about this. So we had these four coins, question marks in the sky here, different in that they were horizontal instead of vertical. How we might implement this in code instead? Well, let's go back to mario.py. Let's delete the vertical version we just did, and there's a bunch of ways I can do this. But let's do it in a way that lets us play around with some new features of Python as well. 
好吧，这个怎么样。所以我们有这四个硬币，天空中这里有一些问号，它们与垂直的不同之处在于它们是水平的。我们如何在代码中实现这个？好吧，让我们回到 mario.py。让我们删除我们刚刚做的垂直版本，我有很多方法可以做到这一点。但让我们以一种让我们可以尝试一些 Python 新特性的方式来做。

For i in range of, let's say, 4-- though I could use a variable if I want-- print out quote unquote question mark, and let's try this. Python of mario.py, Enter-- this is, of course, buggy because they're coming out vertical instead of horizontal. So what's the fix there, intuitively? What do I-- yeah? 
对于 range(4)中的 i，比如说——虽然我可以使用变量——打印出引号中的问号，让我们试试。Python 中的 mario.py，输入——当然，这是有问题的，因为它们是垂直出现的，而不是水平的。那么，直觉上有什么解决办法？我——是的？

AUDIENCE: Add end equals-- 
观众：添加 end=''

DAVID J. MALAN: Yeah, so add end equals quote unquote to turn off the new line by default. That's close now, so if I run mario.py again, I get 4 horizontally, but I don't get the prompt on the new line. So I think I just need one extra print at the end, which does give me a default new line. So if I now run this one more time-- there we go. Now we're back in business. So pretty straightforward-- pretty much the same as in C, albeit with Python's more succinct syntax. But this is kind of cool. 
DAVID J. MALAN：是的，所以添加 end 等于引号来关闭默认换行。现在很接近了，所以如果我现在再次运行 mario.py，我得到 4 个水平排列，但是没有在新行上得到提示。所以我想我只需要在末尾再打印一次，这会给我默认的换行。所以如果我现在再运行一次这个——看，我们回来了。所以这很简单——基本上和 C 语言一样，只是 Python 的语法更简洁。但这真的很酷。

What you can alternatively do in Python, which we've not seen before, if you want to print something four times or some number of times, you can literally say print out a question mark four times. So multiplication is now used in the way that plus kind of is for concatenation. But this does something again and again. Python of mario.py, and that too now works. Doesn't really save us a huge amount of time, but it's kind of cool now that you can do these one liners, so to speak, that achieve a lot more functionality as well. 
在 Python 中，你可以做的是，我们之前没有见过，如果你想打印某物四次或某个次数，你可以说 print out 一个问号四次。现在乘法被用来像加号一样进行连接。但这会重复做同样的事情。Python 的 mario.py 现在也工作了。这并没有节省我们很多时间，但现在你可以用这些单行代码，从某种意义上说，实现更多的功能，这也很酷。

What about this final example we had from the world of Mario Underground, which was a 3 by 3 grid? How could I do this in Python instead? Well, let's go back here and delete the version of code I had there. Just like in C, we can have nested loops, so I could do something like for i in range of 3 and then maybe for j in range of 3, using different variables deliberately here. Let me go ahead and print out a hash mark with no line ending until we're at the end of that row, at which point I do want a line ending, the new line character there. 
那么，关于我们从马里奥地下城世界得到的这个最终示例，它是一个 3x3 的网格，我该如何用 Python 来实现呢？好吧，让我们回到这里，删除我之前那里的代码版本。就像在 C 语言中一样，我们可以有嵌套循环，所以我可以这样做：for i in range(3)，然后也许 for j in range(3)，这里故意使用不同的变量。让我先打印一个没有换行符的井号，直到我们到达那一行的末尾，然后我确实想要一个换行符，即新行字符。

So if I run Python of mario.py, I get a 3 by 3 grid, which roughly resembles what this thing here looks like. Now you don't strictly need all of that because we can combine these ideas for better or for worse. If I go back to my code here, well, if I want to just print out three things, I could just do-- let's see, print quote unquote hash mark times 3 and allow me to have a new line there. And if I run this version, which is a little tighter, I get the same exact thing, too. 
所以，如果我运行 Python 的 mario.py，我会得到一个 3x3 的网格，这大致看起来就像这里的东西。现在你并不严格需要所有这些，因为我们可以合并这些想法，好或不好。如果我回到我的代码这里，嗯，如果我想只打印出三个东西，我可以这样做——让我看看，print "井号" * 3，并允许我在这里换行。如果我运行这个版本，它更紧凑一些，我也会得到完全相同的结果。

So where is the line? Which way do you do it? Whatever is most comfortable to you. And, in fact, when I said earlier that I was doing-- kind of flexing when I implemented dictionary.py using the fewest lines of code possible, that was just because I really wanted to distill it into the essence of the minimal number of lines of code. But I could absolutely have used some loops in dictionary.py. I could have used a little more verboseness. But, as we're seeing here, it's not strictly necessary. Python has even more syntactic sugar, if you will, that lets you achieve more stuff more succinctly. 
那么，线在哪里？您怎么做？您觉得最舒服的方式。事实上，我之前说我在实现 dictionary.py 时尽量使用最少的代码行数，那是因为我真的想把它提炼成最少的代码行数的精髓。但是，我完全可以使用一些循环在 dictionary.py 中。我可以使用一些更冗长的表达。但是，正如我们所看到的，这并不是绝对必要的。Python 甚至有更多的语法糖，如果可以这样说的，让您更简洁地完成更多的事情。

How about, now, some more on lists and dictionaries, just to dovetail with what we did last week. We'll touch on some final features, too, when it comes to command line arguments and using exit commands. And then we'll end with a couple of fun examples that kind of ties this all together. 
现在，让我们再来谈谈列表和字典，以便与上周我们所做的内容相呼应。我们还会涉及到一些关于命令行参数和使用退出命令的最终特性。然后，我们将以几个有趣的小例子结束，这些例子将把所有这些内容串联起来。

So, in Python, we indeed have lists, which are like arrays, but they dynamically resize themselves. So they're effectively linked lists that you don't need to manage yourself. It turns out the documentation for those are at this URL here, but that's discoverable via docs.python.org itself. In particular, there's functions you can use on lists like len, L-E-N, for short, which gives you the length of a list. In C, it was up to you to keep track of the length of an array. In Python-- like in Java, like in JavaScript, if you're familiar-- you can just ask the list how long it is at any moment in time. So that's going to make our lives a little easier as well. 
因此，在 Python 中，我们确实有列表，它们就像数组，但它们可以动态调整大小。所以它们实际上是无需自己管理的链表。那些文档的链接在这里，但可以通过 docs.python.org 本身找到。特别是，列表上有一些你可以使用的函数，比如 len，L-E-N，简称长度，它给你列表的长度。在 C 语言中，你需要自己跟踪数组的长度。在 Python 中——就像在 Java 和 JavaScript 中一样，如果你熟悉——你可以在任何时刻询问列表有多长。这会让我们的生活变得容易一些。

In particular, here's some documentation for that length function, and let me take it out for a spin by recreating some of our prior examples in code. Let me go back to VS Code here, and let me go ahead and create a program called scores.py, which, just like our example in week 2, sort of iterates over quiz scores or homework scores or however you want to think about scores. In Python, I'm going to give myself just a list of three scores, same as in week 2. So scores equals square brackets 72, 73, 33. 
尤其是关于这个长度函数的文档，让我通过重写我们之前的一些示例来试一试。让我回到 VS Code 这里，创建一个名为 scores.py 的程序，就像我们在第 2 周中的示例一样，它遍历测验分数或家庭作业分数，或者你可以这样考虑分数。在 Python 中，我将给自己一个包含三个分数的列表，就像在第 2 周中一样。所以 scores 等于方括号[72, 73, 33]。

So this is different from C. In C, if you were initializing an array with values like these, you would actually use curly braces and a semicolon. And the data type in Python, you use square brackets, no data type, no semicolon, as before. 
所以这与 C 语言不同。在 C 语言中，如果你要使用这些值初始化一个数组，你实际上会使用花括号和分号。在 Python 中，你使用方括号，没有数据类型，没有分号，就像之前一样。

Now let's compute the average of my score. So average equals-- and here's another function that actually exists in Python's documentation. You can actually call a function called sum pass. In most anything that you can iterate over, like a list, passing in scores, and then divide by how many of those things there are, like len, passing in scores there. And now, if I want to print out the average, I can print out, for instance, a format string that says average, colon, and then plugs in that value there. 
现在让我们计算我的分数的平均值。所以平均数等于——这里有一个实际上存在于 Python 文档中的函数。你可以调用一个名为 sum 的函数，传入任何可以迭代的对象，比如 scores 列表，然后除以这些对象的数量，比如传入 scores 的 len。现在，如果我想打印出平均数，我可以打印出一个格式字符串，比如平均数：，然后插入那个值。

I can try running this Python of scores.py, and there's my average as we've seen before, weeks ago, 59.33333 with a little bit of imprecision thrown in for good measure, as before. But what's nice is that, notice, sum just comes with the language. Length just comes with the language. You don't need some annoying for loop or a while loop just to figure out the average of these values by doing all of that math yourself. So that seems to be nice, at a glance. 
我可以尝试运行这个 Python 的 scores.py，就像我们之前几周看到的那样，平均分是 59.33333，稍微有点误差，就像以前一样。但好的是，注意，求和和长度都是语言自带的功能。你不需要用那些讨厌的 for 循环或 while 循环来自己计算这些值的平均值。所以看起来很棒，一眼就能看出。

What else can we do with these here scores? Well, let me propose that we could get them one at a time from the user instead of hard coding them. So let me do this. Let me go ahead and, from CS50's library, import get_int, just so I don't throw any of those exceptions by typing in cat or dog or anything not an integer. 
我们还能用这些分数做些什么呢？好吧，我建议我们可以从用户那里逐个获取它们，而不是硬编码。所以让我这样做。让我从 CS50 的库中导入 get_int，这样我就不会因为输入 cat 或 dog 等非整数而引发异常。

Let's give myself an empty list by just using two square brackets, like that. And now let's go ahead and put things in that list as follows. For i in range of 3, if I want to prompt the user still for three scores for the sake of discussion, let's prompt the user for a score, putting it in a variable called score, setting it equal to the get_int function, prompting them for their first score. But then let's put that score in the list. 
让我通过只使用两个方括号来给自己一个空列表，就像这样。现在让我们继续往这个列表里添加东西，如下所示。对于 3 的范围中的 i，如果我们为了讨论的目的仍然需要用户输入三个分数，那么让我们提示用户输入一个分数，将其放入一个名为 score 的变量中，将其设置为 get_int 函数，提示他们输入他们的第一个分数。但是然后让我们把这个分数放入列表中。

In C, this was a pain in the neck. In C, this was like what you had to do in problem set 5 and build the darn linked list yourself by iterating over the chains and appending it to the end or to the beginning or something like that. In Python, if you want to append a value to an existing list, you do whatever that list is called, scores in this case. You use a method that comes with it called append, and you append that score, and voila, Python takes care of it for you, putting it at the end of the list. 
在 C 语言中，这真是个头疼的问题。在 C 语言中，这就像你在问题集 5 中必须自己做的，通过迭代链表并在末尾或开头添加来构建那个该死的链表。在 Python 中，如果你想向现有的列表中添加一个值，比如这个例子中的 scores，你使用一个与之关联的方法，叫做 append，你添加那个分数，然后，哇，Python 会帮你处理好，把它放在列表的末尾。

Now, outside of that loop, let me calculate the average, just as before, the sum of those scores divided by the length of those scores. Then let's go ahead and print out an f string that says average, colon, and then interpolates the value of that variable. Now, if I didn't screw up, let's try this again. Python of scores.py-- 72, 73, 33, which are now, per that for loop, being added to the list. And then the logic is exactly the same. So way easier than it would have been in C to navigate or manage all of that stuff for me. 
现在，在这个循环之外，让我计算平均值，就像之前一样，这些分数的总和除以这些分数的长度。然后我们继续打印一个 f 字符串，表示平均数，后面跟着变量的值。现在，如果我没有出错，我们再试一次。Python 的 scores.py-- 72, 73, 33，这些现在，按照那个 for 循环，被添加到列表中。逻辑完全一样。所以比在 C 中导航或管理所有这些要容易得多。

There's another way to see this syntactic sugar, if you will. If you don't like this syntax, whereby you are adding to the scores variable a new score by appending it using the built-in append function or method that comes with any list in Python, you can also do this. You can set scores equal to the existing scores list plus another mini list containing just that score. Or I can condense this a little further and say plus equals score. 
如果你不喜欢这种语法，也就是你通过使用内置的 append 函数或方法将新分数添加到 scores 变量中，你也可以这样做。你可以将 scores 设置为现有的 scores 列表加上包含那个分数的另一个小列表。或者我可以进一步简化，说加上等于 score。

So it turns out, plus is overloaded in Python in the sense that it's not a concatenation per se, like for strings, but it's append. You can append more and more things to a list by concatenating two lists together in this way. So, again, it seems the exact same thing, but maybe you prefer the syntax if only because it's a little more concise. But, in short, lists are wonderfully useful in this way. Questions, then, on this here feature as well? We're essentially just solving past problems more easily is the theme, hopefully. 
原来在 Python 中，“+”运算符是重载的，它并不是字符串意义上的连接，而是追加。你可以通过这种方式将两个列表连接起来，不断地向列表中追加更多元素。所以，虽然看起来完全一样，但也许你更喜欢这种语法，因为它更简洁。简而言之，列表在这方面非常有用。那么，关于这个特性，您有什么问题吗？我们实际上是在更轻松地解决过去的问题，希望如此。

How about one other problem, when we implemented a phone book back in week 3? Let me go ahead and do this. In VS Code, let me clear my terminal and close out scores.py, and let me go ahead and create a new program called phonebook.py. And, in this, let's write a program that just iterates over some names, looking for one that I want. 
那么，关于我们在第 3 周实现过的电话簿问题，怎么样？让我先清空我的终端，关闭 scores.py，然后创建一个新的程序，叫做 phonebook.py。在这个程序中，我们将编写一个程序，它会遍历一些名字，寻找我想要的名字。

So maybe I have an array, a list called names, set it equal to 3 of us, as in week 3, so Yuliia and David and maybe John Harvard, like this, all three strings. Then let's go ahead and prompt the user for a specific name using Python's input function or our get_string function, prompting them for a specific name. And now let's do this old school with a for loop for each name in names. And I'm just keeping it short-- n for each name. If the name I'm looking for equals the current name that I'm iterating over, then print out "Found," as we did weeks ago, and then break out of this loop because I'm done, and let's see what happens here. 
所以我可能有一个数组，一个名为 names 的列表，将其设置为 3 个人，就像第 3 周一样，比如 Yuliia、David 和可能还有 John Harvard，就像这样，所有三个字符串。然后我们使用 Python 的 input 函数或我们的 get_string 函数提示用户输入一个特定的名字。现在让我们用老式的方法，用 for 循环遍历 names 中的每个名字。我只是让它保持简短——n 对于每个名字。如果我要找的名字等于我正在迭代的当前名字，那么就打印出“找到了”，就像我们之前几周做的那样，然后跳出这个循环，因为我已经完成了，让我们看看会发生什么。

So Python of phonebook.py-- let's search for my own name, D-A-V-I-D, Enter, and David's name is found. So that's kind of handy. Let's do this once more, search for John. John is now found. Let's search for, say, another name. But let me mistype it, maybe like YULIIA in all caps. I'm not handling any of the capitalization here, so I don't think she will be found. And, indeed, we see no mention of found. 
所以 Python 的 phonebook.py——让我们搜索我的名字，D-A-V-I-D，回车，David 的名字被找到了。这很方便。让我们再试一次，搜索 John。John 现在被找到了。让我们搜索另一个名字，比如说 YULIIA，全部大写。我没有处理任何的大小写，所以我想她不会被发现。果然，我们没有看到“找到了”的提及。

Now this is a feature of Python that's kind of handy, too. And it's a little weird because, in C and in Scratch, the only time you could use else was with conditionals. But we've seen in Python, you can also use else with exceptions, those special errors that can be triggered. . You can even use elses in Python with for loops by saying else print "Not found." And what happens in Python is if Python realizes you never actually break out of this loop yourself, it will then print out this only if you've not broken out, the logic being that, OK, you clearly didn't find who you were looking for, so else let's just say as much. 
现在这是 Python 的一个相当方便的功能，但也有些奇怪，因为在 C 语言和 Scratch 中，你只能在条件语句中使用 else。但在 Python 中，你还可以用 else 与异常一起使用，那些可以触发的特殊错误。你甚至可以在 Python 中使用 else 与 for 循环，通过说 else print "Not found."。在 Python 中，如果 Python 意识到你从未自己跳出这个循环，那么它将只在这种情况下打印出来，逻辑是这样的，好吧，显然你没有找到你要找的人，所以 else 我们就这么说吧。

So if I now run this again, typing in Julia's name all capitalized-- so miscapitalized here-- Enter, I do now see that she's not found. So it's just a nice little trick because it's so common to iterate through things, fail to find a value, and then you just want to say some default-- you want to execute some default line of code as well. 
所以，如果我现在再次运行这个程序，输入全大写的 Julia 的名字——所以这里打错了——Enter，我现在可以看到她没有被找到。所以这是一个很实用的技巧，因为迭代事物是很常见的，找不到值，然后你只想说一些默认的——你想执行一些默认的代码行。

But, turns out, let's tighten this up too. Python does not need you to do all of this work by iterating over every name in the list, checking if each name is in there. Rather, we can tighten this up even more. Let me get rid of this entire for loop and just say this. If the name you're looking for is in the list of names, then print "Found." Else, in this conditional, print "Not found." 
但是，结果证明，我们还可以进一步优化。Python 不需要你通过遍历列表中的每个名称来手动完成所有这些工作，检查每个名称是否在列表中。相反，我们可以进一步优化。让我去掉整个 for 循环，直接这样写。如果你要找的名称在名称列表中，就打印 "找到了。" 否则，在这个条件语句中，打印 "未找到。"

In other words, I can literally just ask Python, you search over the darn list for me, and if it's in there, wherever it is, return True in that Boolean expression-- in that if conditional, the Boolean expression in effect, so I can print out "Found" or "Not found." So this, too, will just work. Let me go ahead and run this again at the bottom. Python of phonebook.py, search for myself, David, and I am indeed found. But I don't need to implement the searching for it left to right. It's still using linear search under the hood, but someone else has now written that code for me, built into the language itself. 
换句话说，我实际上可以直接告诉 Python，让它为我搜索列表，如果找到了，无论它在哪个位置，就在那个布尔表达式中返回 True——在那个 if 条件中，那个布尔表达式实际上就是，这样我就可以打印出 "找到了" 或 "未找到。" 所以这也会正常工作。让我先在底部运行这个代码。在 phonebook.py 中搜索我自己，David，我确实被找到了。但我不需要实现从左到右搜索的功能。它仍然在底层使用线性搜索，但现在有人已经为我编写了这段代码，并内置到语言中。

So what more do we get? So it turns out that, in the world of programming, maybe the most useful, one of the most useful data structures is indeed a hash table, which gave us the abstract data type last time known as a dictionary, which is just a set of key value pairs. What's wonderful about Python, unlike Pset 5 in C, is that you actually get a data type called dict, short for dictionary, which gives you exactly that-- key value pairs, but you don't have to implement any of the darn logic of problem set 5. 
那么，我们还能得到什么？结果是，在编程的世界里，也许最有用的、最有用的数据结构之一确实是哈希表，它在上次抽象数据类型中被称为字典，它仅仅是一系列键值对。Python 的奇妙之处，与 C 语言中的 Pset 5 相比，在于你实际上得到了一个名为 dict 的数据类型，简称字典，它正好提供了这样的键值对，而你不必实现任何问题集 5 中的逻辑。

It still gives you, in effect, something that looks a little something like this in memory-- key value, key value, key value. But you don't have to worry about the array. You don't have to worry about the chains of linked lists. You don't have to worry about the hash function, even. Python takes care of all of that for you. 
它实际上在内存中给你提供了类似这样的东西——键值，键值，键值。但你不必担心数组。你不必担心链表的链。你甚至不必担心哈希函数。Python 为你处理了所有这些。

Now this will be a bit of a mouthful to set up, but let me go ahead and do this. Back in VS Code, I'm going to go ahead and create another version of phonebook.py here by first creating a dictionary of people instead of just a list because, up until now, we've had no phone numbers involved. I do actually want to have a bunch of names and phone numbers. 
这可能需要一点时间来设置，但让我先做这件事。回到 VS Code，我将在 phonebook.py 中创建另一个版本，首先创建一个包含人的字典而不是仅仅一个列表，因为到目前为止，我们还没有涉及电话号码。我确实想有一系列的名字和电话号码。

And the way I'm going to do this is as follows. At the top of this file, I'm going to go ahead and create a list called people. Rather, I'm going to create a list called people. And a list, of course, uses square brackets. But every person now I want to have some keys and values, like a name and a number. So how can I do this? 
我将这样来完成这项工作。在这个文件的顶部，我将创建一个名为“people”的列表。更确切地说，我将创建一个名为“people”的列表。当然，列表使用方括号。但每个现在的人我都想有一些键和值，比如名字和数字。那么我该如何做呢？

Well, I'm going to make some room for this. This is not incorrect. I'm moving this closed square bracket to a new line because I want every element of this list to be very clearly a dictionary, a set of key value pairs. And you couldn't do this in C, but you can do this in Python. In Python, you can use curly braces to represent a dictionary of key value pairs. 
好吧，我将为这个留出一些空间。这并不错误。我将这个闭合的方括号移动到新的一行，因为我希望这个列表的每个元素都非常清楚地是一个字典，一组键值对。在 C 语言中你不能这样做，但在 Python 中你可以这样做。在 Python 中，你可以使用花括号来表示键值对的字典。

How do you define the keys? You put the first key in quotes. You then put a colon, and then you specify the value for that key. If you want another one, you do a comma, you then do quotes, and you do another key, colon, and then its value. And if I think back to week 3, we used plus 1-617-495-1000 for Yuliia's number then. And that's it. It's a little cryptic because it's all in just one line, but it's like having two rows in this visualization here-- name, Julia, number, plus 1-617-495-1000 in that there chart. 
如何定义键？你将第一个键放在引号内。然后是一个冒号，然后指定该键的值。如果你想再添加一个，就在该字典的末尾加一个逗号。然后是引号，再是另一个键，冒号，然后是其值。如果我想起第 3 周，我们使用了+1-617-495-1000 作为 Yuliia 的号码。就是这样。因为它都在一行中，所以有点晦涩，但就像在这个可视化中有两行一样--名字，Julia，号码，图表中的+1-617-495-1000。

So if I want a second one of these, I'm going to put a comma at the end of Yuliia's dictionary. I'm going to put myself on the second line. So open curly brace, quote unquote, name, colon, and then David in quotes, then comma, number, close quote, colon, plus 1-617-495-1000 as well, and then, lastly, a second comma, so that we'll put John Harvard in here so his name is quote unquote "John." His number is +1-949-468-2750. 
如果我想再添加一个这样的，我将在 Yuliia 的字典末尾加一个逗号。我将在下一行添加我自己。所以是开大括号，引号“name”，冒号，然后引号内的“David”，然后是逗号，number，关闭引号，冒号，同样也是+1-617-495-1000，然后最后再加一个逗号，这样我们就可以把 John Harvard 放进来，他的名字是引号内的“John”。他的号码是+1-949-468-2750。

And now we have a list of three dictionaries. Each of those dictionaries has two keys and two values, respectively. Syntactically, this is a pain in the neck, and we would probably just store all of this information in a CSV or a database or something like that. But for now, I typed it all up manually so we have a working example. 
现在我们有一个包含三个字典的列表。每个字典都有两个键和两个值。从语法上来说，这很头疼，我们可能只是会把所有这些信息存储在 CSV 文件或数据库中之类的。但现在，我手动输入了所有这些信息，以便我们有一个可工作的示例。

Now let's actually search this list of dictionaries for the people I want. Let's set a variable called name equal to the return value of input, prompting, as before, the name we care about. Then let's do this for each person in that list of people, let's check if the current person's name equals equals the name the user typed in, then get their number by looking at that person's number field and then go ahead and print out with an f string something like "Found." And then I'll just print out that number in curly braces, and then I will break out of all of this. Or, as before, else let's go ahead and print out "Not found." 
现在我们实际上要在这个字典列表中搜索我想找的人。让我们设置一个变量名为 name，等于之前输入提示的返回值，即我们关心的名字。然后，对于列表中的每个人，让我们检查当前人的名字是否等于用户输入的名字，然后通过查看该人的电话字段来获取他们的电话号码，然后使用 f 字符串打印出“找到了。”然后，我将只打印出大括号中的电话号码，然后我将退出所有这些。或者，就像之前一样，如果没有找到，就打印出“未找到。”

So this is a mouthful, but let's consider what's happening here. First, on line 8, I'm iterating over every person in people. What is people? It is a list of three dictionaries. So on the first iteration is this person, second iteration, this person, third iteration, this person. And Python just takes care of that for me, like we've seen with our for loops already. 
所以这是一大堆话，但让我们考虑一下这里发生了什么。首先，在第 8 行，我在遍历 people 中的每个人。那么 people 是什么？它是一个包含三个字典的列表。所以在第一次迭代是这个人，第二次迭代，这个人，第三次迭代，这个人。Python 就像我们之前看到的 for 循环一样，帮我处理这些。

If that person's name field has this name, then I found the person I'm looking for-- get their number stored in a variable called number if only so that I can print it out with this f string. Else, let's go ahead and print out "Not found" if I never actually break out having found someone. 
如果这个人的 name 字段有这个名字，那么我就找到了我要找的人——将他们的号码存储在一个名为 number 的变量中，以便我可以使用这个 f 字符串打印出来。否则，如果我没有找到任何人，就打印出“未找到”。

Notice, then, that just like in C, when we use square brackets to index into an array, in Python, you can index into a dictionary by literally using the same square bracket notation. So instead of saying bracket 0, bracket 1, bracket 2, you can say bracket name, quote unquote, and that will look up the value for that key. So, again, it's like going into this chart that we see here visually, looking for name in the left column, finding that person's name, looking for the number value in the left column, and looking for its corresponding value at right. It's all sort of happening for us automatically. 
注意，就像在 C 语言中，当我们使用方括号来索引数组时，在 Python 中，你可以通过直接使用相同的方括号符号来索引字典。所以，你可以说方括号名称，引号内的名称，然后它将查找该键的值。所以，再次强调，就像我们在图表中看到的那样，在左侧列中查找名称，找到该人的名称，在左侧列中查找数字值，然后在右侧找到其对应值。这一切都是自动发生的。

Now It turns out we can do this more simply if we, instead, restructure our variable called people. So let me go ahead and do this. Let me go ahead and delete all of the code we just wrote, including that for loop. And let me redefine people as follows. And I'm going to leave the first version up there so we can see before and after. 
现在看来，如果我们重新组织名为 people 的变量，我们可以这样做更简单。让我先做这个。让我先删除我们刚才写的所有代码，包括那个 for 循环。然后我将按照以下方式重新定义 people。我会把第一个版本留在这里，这样我们就可以看到前后对比。

Let's redefine this variable as equaling people, but instead of people being a list of dictionaries, let's just make people one big dictionary, whereby it has two columns, key and value, but where the key this time is going to be the person's name and the value is going to be their number. This is super useful in this case because I only have keys and values, names and numbers. This will not work if I also want to keep track of their email address, their student ID, and multiple values as well. In this case, it suffices to keep track of names and numbers, if only so that I can remove some of this redundancy of saying name, name, name, number, number, number. Let's do it as follows. 
让我们将这个变量重新定义为等于人，但不是将人作为一个字典列表，而是将人变成一个大字典，其中有两列，键和值，但这次键将是人的名字，值将是他们的号码。在这种情况下这非常有用，因为我只有键和值，名字和号码。如果我还想跟踪他们的电子邮件地址、学生 ID 以及多个值，这就不适用了。在这种情况下，只跟踪名字和号码就足够了，这样我就可以减少一些重复说名字、名字、名字、号码、号码、号码的冗余。让我们这样做。

So people equals open curly brace, close curly brace, and let's add a key of Yuliia, whose number is exactly this one here. I'll copy-paste to save time. Let's add another key whose name is David whose value happens to be the same number. Let's add a third key whose value is John and set that equal to this number so that now, at the end of these lines of code, we have Yuliia as a key, David as a key., John as a key, and their numbers respectively as values effectively implementing this chart for everyone instead of one of these charts for each person. 
所以人等于开大括号，闭大括号，然后添加一个键名为 Yuliia，其数字正好是这个。我会复制粘贴以节省时间。再添加一个键，其名为 David，其值恰好是相同的数字。再添加一个键，其值为 John，并将其设置为这个数字，这样现在，在这些代码行的末尾，我们就有了 Yuliia 作为键，David 作为键，John 作为键，以及它们各自的数字作为值，有效地为每个人实现了这个图表，而不是为每个人实现这些图表中的任何一个。

So if I go back to VS Code, let's get rid of the old, more verbose version. Let's go back here and, instead of using any kind of loop now, because there's no list involved, let's just do this-- prompt the user using the input function for the name whose number they want. Then let's just say if the name you're looking for is in that people dictionary, well, great. Go ahead and print out a format string that says that person's number is whatever is in the people dictionary at that name's location. Else let's go ahead and print out, for instance, "Not found." 
因此，如果我回到 VS Code，让我们去掉旧的、更冗长的版本。让我们回到这里，现在不再使用任何循环，因为没有列表涉及，我们只需使用输入函数提示用户他们想查询的名字。然后，如果我们正在查找的名字在 people 字典中，那就太好了。我们可以打印出一个格式化字符串，说明这个人的电话号码是 people 字典中该名字位置上的内容。否则，我们可以打印出“未找到”。

So the only weird thing here, I dare say, is this-- if naming people works just like searching a list, but you can search a dictionary by key, and if you find a key like Julia or David or John, it's going to allow you to use people as well indexed into that chart at the name location with the appropriate row, and that's going to give us implicitly that person's number because even though we don't mention name, we don't mention number, this is what a dictionary is, a collection of key value pairs. And the key can be any string you want, and the value can be anything you want as well. 
我敢说这里唯一奇怪的地方是——如果命名和搜索列表一样，但你可以通过键来搜索字典，如果你找到一个像 Julia、David 或 John 这样的键，它将允许你使用 people 作为索引进入该图表的相应行，这将隐含地给出这个人的电话号码，因为尽管我们没有提到名字，也没有提到电话号码，这就是字典，一个键值对的集合。键可以是任何字符串，值也可以是任何东西。

So that was a lot. But you'll see, then, in the real world, these dictionaries, really, these hash tables underneath the hood are so useful because you can constantly associate one thing with another. Questions on any of this to date? 
所以这有很多。但是，你将会看到，在现实世界中，这些字典，实际上，这些底下的哈希表非常有用，因为你可以不断地将一件事物与另一件事物关联起来。到目前为止，有任何关于这些的问题吗？

OK, a few final examples-- I feel like it's a tough crowd because we're teaching an entire language in a week. But we're almost at the finish line here, and then everything else is going to be icing on the cake. How do we go about implementing now from, in Python, some of the features we eventually introduced in C, namely things like command line arguments, which we've not used thus far in Python. I've gotten all of my input using get_int, get_string, and Python's own input function, but I've never typed any words after the prompt when running Python and the name of a file. 
好的，最后几个例子——我感觉这是一个很难对付的观众，因为我们一周内要教一门完整的语言。但我们几乎就要到达终点了，然后所有其他的事情都将锦上添花。我们现在如何从 Python 中实现一些最终在 C 语言中引入的特性呢？比如命令行参数，我们到目前为止还没有在 Python 中使用过。我所有的输入都是使用 get_int、get_string 和 Python 自己的 input 函数获取的，但我在运行 Python 时从未在提示符后输入过任何单词，也没有输入过文件名。

Well, how can I go about doing this in Python? Well, let me open up my terminal window here. Let's open up a program like greet.py, reminiscent of week 2's greet.c program, and let's do this. From a feature of Python called sys, import argv, which is very different from C, but the same idea at the end of the day. If the length of that argv variable happens to equal 2, let's go ahead and print out a format string that says "hello, comma argv bracket 1," close quote. Else, go ahead and print out the default from week 2, which was just "Hello, world." 
嗯，我该如何在 Python 中完成这个操作呢？嗯，让我在这里打开我的终端窗口。让我们打开一个像 greet.py 这样的程序，就像第 2 周 greet.c 程序一样，然后我们来做这个。从 Python 的一个名为 sys 的功能中导入 argv，这与 C 语言非常不同，但最终的想法是一样的。如果那个 argv 变量的长度恰好等于 2，我们就打印出一个格式字符串，说“hello，逗号 argv 括号 1”，关闭引号。否则，就打印出第 2 周默认的“Hello，world。”

All right, what has just happened? Well, first, let's run it and try to infer. So. Python of greet.py, Enter-- I didn't write any other words after the prompt, so I literally see the default, "Hello, world." What if, though, I write Python of greet.py and then David? Well, what's going to happen here is Python, via this sys library, is going to automatically put every word I typed at the prompt after the name Python into a list called argv by convention. By definition, I can then check how many words are in argv, and if it's 2, that means that the human typed in not only the name of the file to execute but also something after that as well. 
好吧，刚才发生了什么？嗯，首先，让我们运行它并尝试推断。所以。Python 运行 greet.py，输入-- 我在提示符后面没有写任何其他单词，所以我确实看到了默认的 "Hello, world." 那么，如果我现在输入 Python 运行 greet.py 然后 David 呢？那么在这里会发生的事情是 Python，通过这个 sys 库，会自动将我在提示符后面输入的每个单词按照惯例放入一个名为 argv 的列表中。根据定义，我就可以检查 argv 中有多少个单词，如果它是 2，那就意味着人类不仅输入了要执行的文件名，还输入了之后的内容。

So if I now run this by hitting Enter, now I see "Hello, David," because there's two things in that list, greet.py and David. There's no mention of Python because that's the interpreter. And without the interpreter, none of this would work anyway. You get the name of the file and the word you typed after that. 
所以，如果我现在按回车运行，现在我看到 "Hello, David"，因为列表中有两个东西，greet.py 和 David。没有提到 Python，因为那是解释器。而且没有解释器，这一切都不会工作。你得到文件名和你在后面输入的单词。

It's not going to work, though, just like in week 2, if I do David Malan because now, argv's length will be 3 instead of 2, so I'm again going to get the default. But this is to say there is still argv. There's no argc because you can just use the length function, len, to find out what the length of argv now is. 
虽然如此，但就像第 2 周一样，如果我选择 David Malan，因为现在 argv 的长度将是 3 而不是 2，所以我将再次得到默认值。但这是要说明仍然存在 argv。没有 argc，因为你可以使用 len 函数来找出 argv 现在的长度。

What more can we now do? Well, let me go ahead and propose that we introduce how about exit statuses as well, whereby recall that, in C, we had the ability to actually exit with some value, like 0 on success or 1 or anything else upon failure. Turns out that that feature is also tucked away inside of this sys library. Let me go ahead and create another program called, say, exit.py, just to demonstrate this one, let me go ahead and import sys so as to have access not only to argv but also a function in there called exit, which just worked in C, but in Python, we'll see that we want to use the version tucked away in sys. 
我们现在还能做什么呢？好吧，让我先提出，我们不妨引入退出状态，回想一下，在 C 语言中，我们实际上可以退出并返回一些值，比如成功时返回 0，失败时返回 1 或其他任何值。结果证明，这个特性也隐藏在这个 sys 库中。让我再创建一个名为 exit.py 的程序，来演示这一点，让我先导入 sys，以便不仅能够访问 argv，还能访问其中名为 exit 的函数，这个函数在 C 语言中可以工作，但在 Python 中，我们将看到我们想要使用 sys 中隐藏的版本。

Let's do something like this. After importing sys, let's check if the length of argv does not equal two things, let's go ahead and yell at the user quote unquote "Missing command-line argument." And we didn't spend long on this in C, but we did something like this a few weeks back. And then let's go ahead and call exit of 1. Otherwise, if we get down here, let's go ahead and say, as always, a format string of Hello comma sys.argv bracket 1, just as before, so as to greet the user, and then we'll say exit(0). But I do want to use argv that's inside of sys and I want to use exit that's inside of sys because, according to the documentation, that's where these symbols are. 
让我们来做这样的事情。导入 sys 模块后，检查 argv 的长度是否不等于两个参数，然后向前走并告诉用户“缺少命令行参数。”（引号内的话）。在 C 语言中我们没有花太多时间在这上面，但几周前我们确实做了类似的事情。然后我们继续调用 exit(1)。否则，如果我们来到这里，就像往常一样，输出一个格式字符串“Hello, sys.argv[1]”，就像之前一样，以问候用户，然后我们说 exit(0)。但我确实想使用 sys 模块中的 argv 和 exit，因为根据文档，这些符号就在那里。

So I can now do sys.argv, and I can do sys.exit and sys.exit, which just makes super clear that those two symbols, argv and exit, are inside of that sys library. And we did this earlier when I played around with the CS50 library. Either importing specific things or the whole library itself, the idea here is ultimately the same. 
所以我现在可以这样做 sys.argv，我也可以这样做 sys.exit 和 sys.exit，这清楚地表明这两个符号 argv 和 exit 都在 sys 库中。我们之前在玩 CS50 库的时候也这样做过，要么导入特定的东西，要么导入整个库，这里的想法最终是一样的。

So let me run Python of exit.py with no command line argument, so Enter, and I indeed get an error message. And this is probably not something you've needed to run since I last did it. But if you do dollar sign question mark after echo, you can quickly see what was the actual secret exit status. If I run this again with my actual name, David, Enter, I actually get greeted. And if I do that dollar sign question mark again after echo, I see now the secret exit status. So, again, not something we've used often, but by convention-- we can still do in Python what we've been doing in C, namely signaling that something was successful or a failure. 
让我先运行没有命令行参数的 exit.py Python 脚本，按回车，我确实得到了一个错误信息。这可能是自从我上次运行以来你不需要运行的东西。但是，如果你在 echo 后面加上美元符号问号，你可以快速看到实际的退出状态。如果我再次用我的真实名字 David 运行，按回车，我实际上得到了问候。然后，我在 echo 后面再次加上美元符号问号，现在看到了实际的退出状态。所以，虽然我们不太常用，但按照惯例，我们仍然可以在 Python 中做我们在 C 中做过的事情，即表示某件事成功或失败。

Let's do one last set of examples that are reminiscent of past ones, and we'll conclude with two new ones altogether. Recall that we've had this phone book that previously took input just from a hardcoded list of dictionaries or one dictionary. Let's actually reintroduce the idea of CSV files, comma-separated values, whereby we can actually save this information to disk so that we can add and add and add and, heck, even remove names and numbers eventually. 
让我们再做一些与过去类似的例子，然后我们将介绍两个全新的例子。回想一下，我们之前有一个电话簿，它只是从硬编码的列表或一个字典中获取输入。现在让我们重新引入 CSV 文件的概念，即逗号分隔值，这样我们就可以将信息保存到磁盘上，以便我们可以添加和添加，甚至最终删除姓名和号码。

In Python, one of the things that's wonderful is that you have built in support for CSV files. You don't have to worry about the commas, the quotes, or anything like that, as follows. So let me run code of phonebook.py to reopen that same file from earlier. But let's delete everything therein and let me now do this. Let me import Python's own CSV library, which is against comma-separated values, and we used this briefly for my last phonebook a few weeks back. Let's now open a file using the open function that comes with Python it turns out, opening a file called phonebook.csv in append mode so we can add to it as we did done in the past line by line. 
在 Python 中，有一件美妙的事情是，你拥有内置对 CSV 文件的支持。你不必担心逗号、引号或类似的问题，如下所示。那么，让我运行 phonebook.py 的代码，重新打开之前那个文件。但让我们删除里面的所有内容，现在让我这样做。让我导入 Python 自己的 CSV 库，这是针对逗号分隔值的，我们之前在几周前的电话簿中简要使用过。现在让我们使用 Python 自带的开文件函数打开一个文件，结果是在追加模式下打开一个名为 phonebook.csv 的文件，这样我们就可以像以前一样逐行添加内容。

Let me then go ahead and ask the user for a name using input, and then let's ask the user for a number using input. And then let's actually put those that name and number into the file. How can I do this in Python? And, again, the goal here is not to absorb exactly how to do this in Python-- it's certainly reasonable to look this up-- but just to show you how relatively easy it is. 
然后，让我先使用 input 函数询问用户一个名字，然后让我们使用 input 函数询问用户一个电话号码。然后，让我们实际上将这些名字和号码放入文件中。在 Python 中我该如何做？再次强调，这里的目的是不是要精确地了解如何在 Python 中这样做——当然，查找这些信息是合理的——但只是向你展示这相对容易。

I'm going to create a variable called writer. So we could call it anything I want. And I'm going to set that equal to the CSV library's writer function that just comes with it, and I'm going to pass to it the name of that file. This is a feature that says open this file and be ready to write to it hereafter. 
我将创建一个名为 writer 的变量。我们可以将其命名为任何我们想要的。然后我将将其设置为 CSV 库中自带的 writer 函数，并将该文件的名称传递给它。这是一个功能，表示打开此文件并准备好在此之后写入。

How do I do that? I can do writer.writerow, and I can pass in a list of the things I want to write to it. So I can say name comma number in square brackets, so that prints out a new line to the file. And then at the very end of this, let's do file.close to close the whole thing. 
我该如何做呢？我可以使用 writer.writerow，并传递一个包含我想要写入的内容的列表。所以我可以写成 name, number 这样的形式，这样就会在文件中打印出换行符。然后在最后，让我们执行 file.close 来关闭整个操作。

Now let's see what just happened. Let me go ahead and open up phonebook.csv, Enter, which is empty initially because nothing's in there. Let me show it at write continually. Let me now run Python of phonebook.py, Enter, and let's do Yuliia's name-- Yuliia, Enter, and then her number, plus 1-617-495-1000, and watch what happens at top right when I hit Enter because that row will be written. All right, she's now in the file. Let me run it once more with my name, and plus 1-617-495-1000, Enter, and now I am written to that file. And if I want to do this for John Harvard or anyone else, I can do that, then, as well. 
现在让我们看看刚才发生了什么。让我先打开 phonebook.csv，按 Enter 键，它最初是空的，因为里面什么都没有。让我持续显示它。现在让我运行 Python 的 phonebook.py，按 Enter 键，然后输入 Yuliia 的名字-- Yuliia，按 Enter 键，然后她的电话号码，加上 1-617-495-1000，看看当我按 Enter 键时右上角会发生什么，因为那一行会被写入。好的，她现在已经在文件里了。让我再用我的名字运行一次，加上 1-617-495-1000，按 Enter 键，现在我已经被写入那个文件。如果我想为 John Harvard 或其他人做这件事，我也可以这样做。

So what's nice is that notice that the writerow function is actually outputting the commas for me. And if there were weird characters or commas, it would actually escape them by using quotes as well. As with Python in general, I can tighten this up further. In fact, it turns out that, in Python, you don't need to be so pedantic as to open the file, then do some stuff, then close the file. There's this weird other preposition in Python, namely width, that allows you to do multiple things at once. 
很好的是，注意 writerow 函数实际上在为我输出逗号。如果有奇怪的字符或逗号，它实际上也会通过使用引号来转义它们。就像 Python 本身一样，我可以进一步优化它。事实上，在 Python 中，你不需要那么严格地打开文件，做一些事情，然后关闭文件。Python 中有一个奇怪的另一个前置词，即 with，它允许你一次做很多事情。

So let me do this. Let me get rid of the close line and let me instead do this-- with open as file colon, and then let me indent all of this here. That now is going to have the effect of actually doing all of that but automatically closing the file for me so I don't run the risk of forgetting, maybe leaking some memory somehow, and so forth. 
所以让我来做这件事。让我去掉关闭行，然后让我这样做--用 open 作为 file 冒号，然后让我把这里的所有内容都缩进。这样现在将会产生实际执行所有这些操作的效果，但会自动关闭文件，这样我就不会忘记，可能以某种方式泄露一些内存，等等。

And there's one final flourish I can do here, too. Right now, I'm using this basic writer function which essentially just writes a list, writes a list, writes a list. There's one other way where I can write dictionary after dictionary after dictionary, which is handy, especially if I don't just have names and numbers, but maybe email addresses and student ID numbers and other types of values as well. 
在这里我还可以做一个最后的点缀。现在，我正在使用这个基本的写入函数，它本质上只是写一个列表，写一个列表，写一个列表。还有一种方式，我可以一个接一个地写字典，这很方便，尤其是当我不只是有名字和数字时，也许还有电子邮件地址、学生 ID 号和其他类型的值。

And I can do it as follows. Let me go ahead and let me say-- oops, and, actually, just to be clear, this code can be outside of that width because I can ask for this once without the file actually being opened yet. So let's change just these two lines here. I can create a writer, but this time use a dictionary writer, which allows me, again, to write dictionaries-- key value pairs instead of just lists of values lists. 
我可以这样操作。让我先说——哎呀，实际上，为了清楚起见，这段代码可以放在那个宽度之外，因为我可以在文件实际打开之前就请求它。所以让我们只改变这两行。我可以创建一个写入器，但这次使用字典写入器，这让我再次能够写入键值对，而不是仅仅是一系列的值列表。

I can say use this file for my dictionaries. Let's use field names of quote unquote name comma number, and then let's go ahead after that and do writer dot write row. And I can now pass in any dictionary I want that I want written to that file. So I can do name colon name and then, for instance, number colon number. And let me go ahead and reopen phonebook.csv, Enter. Let me move it right here. Let me delete all of that. 
我可以说，用这个文件来创建我的字典。让我们使用引号中的名称、逗号和数字作为字段名，然后继续进行。现在我可以将任何我想写入该文件的字典传递进去。所以我可以这样做：名称：名称，例如，数字：数字。现在让我重新打开 phonebook.csv，输入。让我把它移到这里。让我删除所有这些。

And notice what happens this time. More like your real world of using Excel and Google Sheets and Apple Numbers, notice now, when I run Python of phonebook.py, Enter, and I type in Yuliia and plus 1-617-495-1000, Enter, notice that it, too, works as well. And if I wanted to, as well, using a dictionary writer, I could additionally tell this writer to include the names of these columns in that file so that when I open it up in Excel or Apple Numbers or Google Sheets, also, the data is described in that first row of headers that you're probably familiar with from having just used spreadsheets in the real world. 
注意这次发生了什么。更像是你在使用 Excel、Google Sheets 和 Apple Numbers 的实际情况。注意现在，当我运行 Python 的 phonebook.py 并输入 Yuliia 和 1-617-495-1000 时，它也能正常工作。而且，如果我想的话，使用字典写入器，我还可以让这个写入器将列名包含在该文件中，这样当我在 Excel、Apple Numbers 或 Google Sheets 中打开它时，数据也会在您可能从实际使用电子表格中熟悉的那个标题行中描述。

So, long story short, this is not to ingrain in you exactly how you read and write CSVs or write in this case, but rather, with just a few lines of code, like six lines of code, you can do a lot more in Python than you can in C. 
所以，长话短说，这并不是要让你精确地了解如何读取和写入 CSV 文件，或者在这个例子中如何编写代码，而是说，只需几行代码，比如六行代码，你就能在 Python 中完成比在 C 语言中更多的事情。

So now to end on a lighter note, let's do this. It turns out, in Python, there's not only all of these libraries that come with the language, but there's also third-party ones that you can install as well. And there's a program you can run in a Linux environment, like your own code space, called pip, which allows you to install additional packages-- that is to say, third-party libraries that other people have written. 
现在让我们轻松一下，来做这个。结果是，在 Python 中，不仅有随语言一起提供的所有库，还有你可以安装的第三方库。你可以在 Linux 环境中运行一个程序，比如你自己的代码空间，叫做 pip，它允许你安装额外的包——也就是说，其他人编写的第三方库。

What this means is that, in advance, of your using cs50.dev, we essentially ran pip install cs50 to make sure that, by default, you just have access to CS50's own library. It does not come with Python, but it's out there in the cloud somewhere, and pip knows how to install it. 
这意味着在你使用 cs50.dev 之前，我们实际上已经运行了 pip install cs50 来确保默认情况下，你就可以访问 CS50 的库。这个库不是 Python 的一部分，但它存在于云中某个地方，pip 知道如何安装它。

But suppose I want to do something fun, like from a few weeks back, where we did cowsay, and we had a cow moo on the screen. And we had a dragon and other things too. Well, it turns out there's a package called cowsay that I can install for Python with pip install cowsay, Enter. You'll see on the screen a bunch of stuff happening because it's downloading it, and it's installing it into the appropriate location. But now this means there is a library called cowsay in my own code space. So if I go ahead and create a program called, like, moo.py in this file, I can now import cowsay, which will give me access to any functions and symbols therein. 
但是假设我想做一些有趣的事情，就像几周前我们做的 cowsay 一样，我们在屏幕上让一头牛哞哞叫。还有龙和其他东西。嗯，结果有一个叫做 cowsay 的包，我可以使用 pip install cowsay 来安装 Python。输入。你会在屏幕上看到很多东西在发生，因为它正在下载，并且安装到适当的位置。但现在这意味着在我的代码空间中有一个名为 cowsay 的库。所以，如果我创建一个名为 moo.py 的程序，我就可以导入 cowsay，这样我就可以访问其中的任何函数和符号。

And I can do something like this per its documentation-- cowsay library dot cow, because this is going to print a cow on the screen, and I can say "This is CS50." And down here, I can do Python of moo.py, Enter-- oh, let's make the terminal window bigger. Let's do this again-- Python of moo.py, Enter, and I get a cow saying, "This is CS50" in a little speech bubble, like that. 
根据其文档，我可以这样做-- cowsay 库的点 cow，因为这将打印一头牛到屏幕上，我可以说“这是 CS50。”在这里，我可以运行 Python 的 moo.py，输入--哦，让我们把终端窗口放大。我们再试一次-- 运行 Python 的 moo.py，输入，然后我得到一头牛在小小的话泡里说，“这是 CS50”。

I can make it more interesting now in code, though, as follows. If I shrink my terminal window and I use something like Python's input function, I can ask the user for their name, like, what's your name, as we did way back with Scratch and then C. And then I can use one of these f strings in here. And instead of saying, "This is CS50," I can say something like, "Hello, name" in curly braces. Then, down here, I'll make my terminal window bigger. Run Python of moo.py, Enter-- what's my name? David, Enter-- and now the cow is mooing dynamically based on what I've just actually typed in. 
我现在可以在代码中让它更有趣，如下所示。如果我缩小我的终端窗口，并使用 Python 的 input 函数，我可以要求用户输入他们的名字，比如，你叫什么名字，就像我们以前在 Scratch 和 C 语言中做的那样。然后，我可以在其中使用这些 f 字符串之一。而不是说“这是 CS50”，我可以说“你好，名字”这样的内容。然后，在这里，我会把我的终端窗口放大。运行 Python 的 moo.py，输入-- 输入我的名字？大卫，输入-- 现在牛的叫声是根据我刚才实际输入的内容动态生成的。

We can do things even fancier than this. Lastly, let me see if I can type this out correctly. In my terminal window, let me go ahead and install pip install qrcode, these two-dimensional bar codes nowadays that are seemingly everywhere. This is going to install a library that's going to know how to automatically create a 2D bar code for me based on any text that I give it, including a URL, because someone else wrote the code that figured out how to do all of that and output a two-dimensional code. 
我们甚至可以做得比这更花哨。最后，让我看看我能否正确地打出这个。在我的终端窗口中，让我先安装 pip install qrcode，现在到处都能看到的这些二维条形码。这将安装一个库，它将知道如何根据我给出的任何文本自动创建一个二维条形码，包括 URL，因为有人编写了代码，解决了如何做到这一点，并输出一个二维条形码。

So let me go into a program called qr.py that I myself will write, but I'm going to stand on that person's shoulders and I'm going to import a Python OS library, which gives me access to the file system so I can read and write files, and I'm going to import that person's library, qrcode. I'm going to now create a variable called image, set it equal to qrcode.make, because I want to make a QR code, and I'm going to type in the URL of one of CS50's lectures, so https://youtu.be/xvFZjo5PgG0, and, hopefully, I made no typographical errors there. 
让我来介绍一下我自己将要编写的名为 qr.py 的程序，我将站在那个人的肩膀上，并导入 Python 的 OS 库，这样我就可以访问文件系统来读写文件了。接下来，我将导入那个人的库 qrcode。现在，我将创建一个名为 image 的变量，将其设置为 qrcode.make，因为我想要生成一个二维码，并输入 CS50 讲座之一的 URL，即 https://youtu.be/xvFZjo5PgG0，希望这里没有打错字。

Then, on my next line, I'm going to call image, which is the name of that variable, dot save. I'm going to save this as a file called qr.png. Turns out, this library supports different file formats, like PNG, for Portable Network Graphics. So I'm going to say, give me that type of file. Then I'm going to go ahead and run this program as follows, Python of qr.py, Enter-- no errors. I'm going to now open up qr.png, Enter, hide my terminal window, give you all a chance to open your phone, and open the URL that's secretly embedded in this QR code, and at the risk of incurring your ire-- there we go-- this was CS50. We'll see you next time. 
然后，在下一行，我将调用名为 image 的变量。我将将其保存为名为 qr.png 的文件。这个库支持不同的文件格式，比如 PNG，即便携式网络图形。所以我会说，给我这种类型的文件。然后，我将运行这个程序，如下所示，Python qr.py，回车--没有错误。现在我将打开 qr.png，回车，隐藏我的终端窗口，给大家机会打开手机，打开这个二维码中秘密嵌入的 URL，冒着引起你们不悦的风险--就这样--这是 CS50。下次见。

[APPLAUSE]   [掌声]

