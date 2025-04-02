[⚠  ⚠MUSIC PLAYING] DAVID J. MALAN: All right. This is CS50. This is week one, because of course, last week was week zero. And this is the week where we'll actually start programming in a much more traditional way, that programming language we promised called C. 
音乐播放] 大卫·J·马尔兰：好的。这是 CS50。这是第一周，因为当然，上周是零周。而这将是我们将以更传统的方式开始编程的一周，我们承诺的编程语言叫做 C。

Of course, we started with this. And hopefully by now, with problem set 1, you've had a little bit of fun, even if you've played with it before. And the goals of Scratch, beyond making things feel very accessible and user friendly is really to elucidate some of the fundamental concepts that we'll see again today, and really every week subsequently, like functions and conditionals and loops and variables and so much more. 
当然，我们是从这个开始的。希望到现在，通过问题集 1，你已经有点乐趣，即使你之前玩过。Scratch 的目标，除了让事物感觉非常易于访问和用户友好之外，还真正地阐明了我们今天和随后的每一周都会再次看到的某些基本概念，比如函数、条件、循环、变量等等。

And in fact, among the goals of Scratch is, again, to plant these visuals in your mind. So even as today onward feels all the more like a fire hose, especially when it comes to really weird, cryptic textual syntax, the ideas are still going to be the same. So today, this program, Hello, world, becomes this instead. 
事实上，Scratch 的目标之一就是再次在你的脑海中植入这些视觉元素。所以，即使从今天开始，尤其是当涉及到真正奇怪、晦涩的文本语法时，感觉就像一股洪流，但理念仍然是相同的。所以，今天的这个程序“Hello, world”变成了这样。

And in fact, just to color code things temporarily, I dare say that what I've color coded here in orange, which looks probably, to those of you who've never programmed, pretty cryptic is the equivalent of when green flag clicked orange puzzle piece like this. 
事实上，为了暂时区分颜色，我敢说这里用橙色标注的部分，对于那些从未编程过的人来说可能看起来很晦涩，相当于点击绿色旗帜的橙色拼图块一样。

What remains is just one line in purple with a bit of white, which is what ultimately is going to get the screen today to say, Hello, world on the screen. And of course, we had a name for something in purple. In fact, if we rewind to week zero, this block in purple represented what type of functionality? 
剩下的只是一行紫色和一点白色的代码，这就是最终会在屏幕上显示“Hello, world”的原因。当然，我们给紫色部分的东西起了一个名字。实际上，如果我们回到零周，这个紫色块代表了什么类型的功能？

AUDIENCE: [INAUDIBLE].   观众：[听不清]。

DAVID J. MALAN: A function itself, an action, a verb that gets the computer to do something. So what looked like this last week is about to look like this. Let's take away the color coding and focus really on what we're going to now start calling source code. 
大卫·J·马尔安：一个函数本身，一个动作，一个动词，让计算机做某事。所以上周看起来是这样的，现在即将变成这样。让我们去掉颜色编码，真正关注我们现在开始称之为源代码的部分。

So this is what programmers do in the real world. This is what software developers, software engineers do in the real world. They write code that looks like this. And clearly, it's a little English-like, but it's not English in the way you would compose an essay or an email. Clearly, there's some patterns and some special syntax to it that will highlight ultimately today. 
所以这就是程序员在现实世界中所做的事情。这就是软件开发者、软件工程师在现实世界中所做的事情。他们编写看起来这样的代码。显然，它有点像英语，但并不是像你写文章或邮件那样使用英语。显然，它有一些模式和特殊的语法，最终会突出显示。

The problem is, though, that computers, of course, don't understand source code. They only, per last week, understand zeros and ones. That is it, the so-called binary system. So somehow, we've got to get what already looks cryptic into something that looks at a glance even more cryptic, the zeros and ones that computers do understand. 
然而，问题是，当然，计算机不能理解源代码。它们只理解上周的零和一。这就是所谓的二进制系统。所以，我们必须把已经看起来很神秘的代码转换成计算机能理解的，看起来更加神秘的零和一。

And for today's purposes, just know that built into your Macs, PCs and phones, there is a built in understanding of what these patterns mean. Maybe it means a number, maybe it means a letter. But today, maybe it means an instruction, like print something on the screen, or save something, or load something. 
对于今天的目的来说，只需知道，在你的 Mac、PC 和手机中，内置了对这些模式的理解。这可能意味着一个数字，可能意味着一个字母。但今天，这可能意味着一个指令，比如在屏幕上打印某物，或者保存某物，或者加载某物。

That is to say, computers use patterns of bits not only to represent all the stuff we talked about last week-- numbers, letters, colors, images, sounds, and all of that, they also use patterns of bits to represent fundamental functionality. Print things, play things, much like those same scratch blocks. 
换句话说，计算机不仅使用位模式来表示我们上周讨论的所有内容——数字、字母、颜色、图像、声音等等，它们还使用位模式来表示基本功能。打印东西，播放东西，就像那些相同的积木一样。

But no computer scientist really, unless they take out a paper pencil or write a program or use a website to convert this can read this and know what's going on. That's why we humans are actually going to use not machine code, as it is called, the zeros and ones that computers understand, we are going to start writing source code. And last week you already wrote source code, but in the form of dragging and dropping those puzzle pieces. 
但除非他们拿出纸笔或编写程序或使用网站进行转换，否则没有真正的计算机科学家能真正读懂这些。这就是为什么我们人类实际上会使用所谓的机器码，也就是计算机理解的零和一，我们将开始编写源代码。而且上周你们已经编写了源代码，但形式是拖放那些拼图块。

So this too is going to be the paradigm that sort of guides us through the entire semester. Problem solving programming is really about input becoming output. And we'll focus today then on a certain type of input becoming output. Someone has to get the source code, that's written in a language like C, into the machine code, the zeros and ones that the computer actually understands. 
因此，这也将成为在整个学期中引导我们的范式。问题解决编程实际上就是输入变成输出。今天我们将重点关注一种类型的输入变成输出。有人必须将用 C 语言等编写的源代码转换成机器码，即计算机真正理解的零和一。

So source code today is going to be our input. Machine code is going to be our output. And we're going to give you today a special program called a compiler, whose purpose in life is to translate one to the other. And there's compilers for different languages in the world. We're going to focus on one that supports today's language, known as C. 
今天我们将源代码作为输入。机器代码将是我们的输出。今天我们将向您提供一个名为编译器的特殊程序，其存在的目的就是将一种语言翻译成另一种语言。世界上有各种语言的编译器。我们将关注一种支持今天语言的编译器，这种语言被称为 C 语言。

And here, as promised, is the programming environment we are going to use. It's tailored to CS50, which is to say, we've pre-installed certain software that you might find useful during the term. But for all intents and purposes, the tool you will use for CS50 problem sets henceforth is a very popular industry standard tool called Visual Studio Code, or VS Code for short. 
如承诺，这是我们将要使用的编程环境。它是为 CS50 量身定制的，也就是说，我们已经预装了一些您在学期中可能会用到的软件。但就 CS50 问题集而言，您将使用的是一个非常流行的行业标准工具，简称 Visual Studio Code 或 VS Code。

We are using a cloud based version of it that lives at literally this URL, cs50.dev. You can sign in to that so long as you have a free GitHub account, for which you signed up presumably already. And that will give you access to not only an industry standard programming environment, but again, an environment that has some CS50 specific things pre-installed. 
我们使用的是基于云的版本，网址为 cs50.dev。只要您有一个免费的 GitHub 账户，您就可以登录该账户，您可能已经注册了。这将使您不仅能够访问行业标准编程环境，而且还能访问一些预装了 CS50 特定内容的编程环境。

And at the end of the semester, or even in the middle, if you so you're so inclined, you can actually download for free VS Code onto your Mac, PC. You can disconnect from the internet and you can actually program on your own computer. Caveat, though, is that you tend to hit technical support headaches in the very beginning of the term, so we suggest you do that later in the term once you're already comfortable with this cloud based environment here. 
学期结束时，或者如果你愿意的话，在学期中间，你实际上可以免费下载 VS Code 到你的 Mac 或 PC 上。你可以断开互联网连接，并在自己的电脑上编程。但是，需要注意的是，你可能会在学期初期遇到技术支持问题，所以我们建议你在熟悉这个基于云的环境之后再进行操作。

And here it is. This is what programming shall look like, whether we're using C now or Python in a few weeks or JavaScript or SQL thereafter. So here is what looks-- what is VS Code configured as follows. At the top right, you'll generally have one or more tabs for code, much like tabs in a browser. 
就在这里。无论我们现在使用 C 语言还是几周后使用 Python，或者之后使用 JavaScript 或 SQL，编程都应该这样。所以这里就是 VS Code 的配置，在右上角，你通常会有一个或多个代码标签页，就像浏览器中的标签页一样。

And this is where you'll write code that looks a little something like this. And in fact, this is exactly the code that you saw a moment ago. What VS Code does, among other things, is it actually highlights your code for you. It colorizes it in what's generally an illuminating way. So I did not choose to make this red. I did not choose to make this blue and this purple. The computer sort of automatically does that for you, as we'll soon see to draw your attention to different ideas in the program itself that all happens automatically. 
这就是您将要编写代码的地方，代码看起来可能有点像这样。实际上，这正是您刚才看到的代码。VS Code 在众多功能中，实际上会帮您突出显示代码。它会以通常很亮丽的方式为代码着色。所以我没有选择将其设置为红色，也没有选择将其设置为蓝色和紫色。计算机几乎会自动为您完成这些，以便吸引您注意程序中的不同想法，这一切都是自动发生的。

At the bottom here, you're going to use a more advanced interface today onward, known as a command line interface in the form of a terminal window. So you can still use your mouse or trackpad and click and drag and do things like that in this environment. But you'll find, and many programmers prefer that it's much more efficient ultimately to use your keyboard more often than the mouse or the trackpad. So we'll introduce you to that text based terminal window there. 
从现在开始，您将使用一个更高级的界面，即终端窗口形式的命令行界面。所以您仍然可以使用鼠标或触摸板进行点击和拖动等操作。但您会发现，许多程序员更喜欢最终更高效地使用键盘而不是鼠标或触摸板。所以我们将向您介绍那个基于文本的终端窗口。

Up here at top left, you'll have a File Explorer. So what's nice about VS Code is that not only will you have textual commands, with which you'll get comfy, you also have a normal Mac or PC or phone nowadays, like literally files and folders will visually appear to you so you can play with or manipulate them there. 
在这里顶部左侧，你会看到一个文件资源管理器。所以 VS Code 的好处不仅仅是你会用到文本命令，让你感到舒适，而且现在你有一个正常的 Mac 或 PC 或手机，文件和文件夹会直观地显示给你，你可以在这里操作或处理它们。

And then, lastly, this is sort of like the menu, the so-called activity bar that just has icons for various features, including CS50's duck. So in fact, if you poke around, you'll see ultimately a duck icon when you log in, which is your own CS50 specific chat bot of which you can ask questions throughout the process. 
然后，最后，这有点像菜单，所谓的活动栏，上面有各种功能的图标，包括 CS50 的鸭子图标。实际上，如果你四处看看，你会看到登录时最终会出现一个鸭子图标，这是你的 CS50 特定的聊天机器人，你可以在整个过程中向它提问。

So now that we've got VS Code here, let's go ahead and actually consider what it represents. So this is generally, for jargon sake, a graphical user interface, which means buttons and icons and menus and all of that. We all take that for granted on most any device nowadays. That's abbreviated, just so you know, as GUI, G-U-I. But built into VS Code, again, is what's not only the terminal window by name, but conceptually this is a command line interface. 
现在我们已经安装了 VS Code，让我们来考虑一下它代表什么。这通常是一个图形用户界面，意味着按钮、图标、菜单等等。我们在大多数设备上现在都把它视为理所当然。简而言之，这就是 GUI，G-U-I。但 VS Code 内置的不仅仅是名为终端窗口的东西，从概念上讲，这是一个命令行界面。

So not a graphical user interface, but a command line interface, whereby there aren't icons to click on or double click on. Rather, if you want to run a program, you use the command line interface, or CLI, to type the name of the program that you want to run. And so this will feel like a step backwards initially today, because we all tap and point and double click on things nowadays. But again, it's going to give us more power, more efficiency ultimately beyond this. 
所以这不是一个图形用户界面，而是一个命令行界面，其中没有图标可以点击或双击。相反，如果你想运行一个程序，你需要使用命令行界面，或者说是 CLI，来输入你想要运行的程序名称。因此，今天这可能会让你感觉像是退步了一步，因为我们现在都习惯于点击、指向和双击。但再次强调，这最终会给我们带来更多的力量，更高的效率。

So with that said, let's go ahead and actually use it for just a moment. During class, you're welcome to follow along. But suffice it to say, we'll generally go somewhat quickly. Really, you're going to learn how to program by way of the problem sets each week. I'll introduce and focus on the concepts, the ideas, the sort of primitives that will get you started, but only through actually doing the problem sets is the muscle memory and practice going to come. So not to worry if it doesn't all go down easily the first time around. 
话虽如此，让我们先实际使用一下。在课堂上，你可以随时跟上。但简而言之，我们通常会很快地完成。实际上，你将通过每周的问题集来学习编程。我会介绍并关注概念、想法和原始的元素，这些将帮助你入门，但只有通过实际完成问题集，才能培养肌肉记忆和实践。所以，如果第一次不是很容易上手，请不要担心。

So here is the code that I claim is equivalent to last week's Hello, world program. Let's actually go ahead and do this in the programming environment. So I'm going to go ahead and switch over to VS Code itself, which is now running on my Mac here. It's not just a screenshot. And I'm going to go ahead and do the following to get started with programming. 
所以这就是我声称与上周的“Hello, world”程序等效的代码。让我们实际在编程环境中进行操作。我要切换到 VS Code，它现在在我的 Mac 上运行。这不是截图。然后我将开始以下操作来开始编程。

I'm going to write literally in my terminal window, the word code, and I might have to give it focus by clicking down in that quadrant of the screen. And then I'm going to give the name of the file that I want to code. And in this case, I'm going to propose that we call it hello.c. 
我将在终端窗口中直接输入单词“code”，可能需要通过点击屏幕的那个区域来获取焦点。然后我将给出我想要编写的文件名。在这种情况下，我建议我们将其命名为“hello.c”。

In the world of Scratch, when you downloaded it, you might have noticed the files are all called like SB3 or some such file extension. When writing code in C, you literally name the file something dot C by convention. 
在 Scratch 的世界里，当你下载它时，你可能已经注意到文件都叫 SB3 或类似的文件扩展名。在用 C 语言编写代码时，按照惯例，你实际上会命名文件为“点 C”。

But notice some other details. Especially if I zoom in, everything I've typed thus far is lowercase. There's no spaces. And so this is going to be important. And unfortunately, computers are not forgiving. And odds are one of the first stupid mistakes you'll do is miscapitalize something, misspell something, add too many spaces or the like. 
但请注意一些其他细节。特别是如果我放大，到目前为止我输入的所有内容都是小写的。没有空格。因此这一点很重要。不幸的是，计算机并不宽容。而且，你可能会犯的第一个愚蠢的错误就是拼写错误，打字错误，或者添加太多空格等等。

Not to worry. In time, that kind of muscle memory will come with practice. So let me zoom out. Let me now just hit Enter and you'll see at top right the Code tab that I promised. So I'm going to go ahead and type out this program pretty quickly, because I've done it before. Include stdio.h, int main void, and then some curly braces, as they're called, and then printf quote unquote. Hello, comma, world, backslash n, close quote, semicolon. All right. So that's a lot. But that too will come in time with practice. But this is the exact same code that we saw just a moment ago. 
别担心。随着时间的推移，这种肌肉记忆会随着练习而形成。所以让我缩小一下。现在我只是按 Enter 键，你会在右上角看到我承诺的代码标签。所以我会很快地输入这个程序，因为我以前做过。包含 stdio.h，int main void，然后是一些称为花括号的，然后是 printf " "。Hello,逗号，world，反斜杠 n，关闭引号，分号。好了。这有很多。但随着时间的推移，通过练习，这一切都会变得容易。但这正是我们刚才看到的相同代码。

Indeed, if I zoom in, it's color coded just as in the screenshot, and thus I have written my first program. VS Code will automatically save for you, but you can also hit control or Command S to ensure that it's saved. But notice what's happened at top left. Not only do you see my code over here, you see a visual icon, just like on a Mac or PC that, yes, this file now exists in your account. 
事实上，如果我放大，它就像截图中的那样进行了颜色编码，因此我编写了我的第一个程序。VS Code 会自动为您保存，但您也可以按 Ctrl 或 Command S 来确保它已保存。但请注意左上角发生了什么。您不仅在这里看到了我的代码，还看到了一个视觉图标，就像在 Mac 或 PC 上一样，是的，这个文件现在存在于您的账户中。

And that too is what you're getting with VS Code for CS50. You're getting your own sort of server in the cloud. It's called a container nowadays. So there's some virtual disk space somewhere in the cloud, ala iCloud or Google Drive, that's going to store all of your files. And at the moment, because I refreshed my account before class, I only have one file in my own account. 
这也是您在 CS50 中使用 VS Code 所获得的。您将获得自己的某种云服务器。现在我们称之为容器。所以，在云中某个地方有一些虚拟磁盘空间，类似于 iCloud 或 Google Drive，将存储您所有的文件。目前，因为我课前刷新了我的账户，所以我自己的账户中只有一个文件。

What's this? What's this? Well, this is like my ID number for GitHub. Not really a big deal. That's just randomly generated by GitHub. Urban Adventure is the name of my programming environment today, otherwise known as a code space. This is just a GitHub thing which is, again, one of these cloud companies. 
这是怎么回事？这是怎么回事？嗯，这是我的 GitHub ID 号码。这并不是什么大问题。这只是 GitHub 随机生成的。Urban Adventure 是我今天的编程环境名称，也称为代码空间。这是 GitHub 的一个东西，这同样是一家云公司。

Instead of choosing random letters and numbers to uniquely identify all of our programming environments, it's popular in the tech industry nowadays to just put together random English words that sometimes sound kind of cool. But it's just by coincidence, not something I chose. Yours will be different. 
与其随机选择字母和数字来唯一标识我们的编程环境，如今在科技行业流行的是简单地拼凑一些随机的英文单词，有时听起来还挺酷。但这只是巧合，并不是我刻意选择的。你的将会不同。

All right, so I've written some code. I created hello.c. I typed in all of that code. I confirmed visually at left that it was created. I'm going to hide my File Explorer henceforth, just so that we can focus on the code. How do I actually run this program? 
好的，所以我已经编写了一些代码。我创建了 hello.c。我输入了所有这些代码。我通过视觉确认了左边它已经被创建。从今往后我将隐藏我的文件资源管理器，以便我们能够专注于代码。我该如何实际运行这个程序呢？

Well, on a Mac or a PC, we would be in the habit of like opening the folder and double clicking on it. Or on your phone, you would take it out and tap on an icon. But not here. Here, we're focusing primarily on the command line interface within this whole environment. 
在 Mac 或 PC 上，我们习惯于打开文件夹，双击它。或者在手机上，你会取出它并点击图标。但在这里不是这样。在这里，我们主要关注的是这个环境中的命令行界面。

So I'm actually going to have to introduce a few commands. You saw already the code command, which for our purposes is VS Code specific, that just creates a new file called hello.c in this case. But I need two other commands to actually run this program. 
所以我实际上需要介绍一些命令。你已经看到了代码命令，在我们的用途中是 VS Code 特定的，它只是在这个例子中创建了一个名为 hello.c 的新文件。但我还需要两个其他命令来实际运行这个程序。

The first nicely is called make, and then I specify what program I want to make. And then a little weirdly, I have to type dot slash hello. But just to take a step back, make hello. If this is about to be my second command that I type, what does that step represent, perhaps? Given what I said just a minute or so ago. 
第一个命令叫做 make，然后我指定我想编译的程序。然后有点奇怪，我必须输入点斜杠 hello。但先退一步，make hello。如果这即将成为我输入的第二条命令，那么这一步可能代表什么？考虑到我刚才说的。

AUDIENCE: That's going to translate your source code into ones and zeroes. 
观众：这会将你的源代码转换成零和一。

DAVID J. MALAN: Perfect. So make represents the compiler, so to speak, the program that converts source code to machine code. I have to do that for now manually by running make hello. Now, make is kind of smart, and even though I'm saying make hello, not make hello.c, make it smart, and it's going to say, if you want to make a program called hello, I'm going to assume that there is somewhere in this folder a file called hello.c. So you should not type make hello.c. You just type make hello. 
大卫·J·马尔安：太好了。所以 make 相当于编译器，也就是说，将源代码转换为机器代码的程序。我现在必须手动运行 make hello 来做到这一点。现在，make 相当智能，尽管我说 make hello，而不是 make hello.c，它会智能地假设，如果你想创建一个名为 hello 的程序，那么在这个文件夹中应该有一个名为 hello.c 的文件。所以你不需要输入 make hello.c，你只需要输入 make hello。

And then this third command, even more cryptic, what might it do? If this is step three of three. That's going to run the machine code. It's going to tell the computer in this folder, the dot implies this current folder, and dot slash just means something in this current folder. Run the program called Hello. 
然后这个第三个命令，更加神秘，它可能做什么？如果这是第三步。它将运行机器代码。它会告诉这个文件夹中的计算机，点表示当前文件夹，点斜杠表示当前文件夹中的某个东西。运行名为 Hello 的程序。

So that's it. Like there's three steps to writing a program in C. You create the file, as with the code command. But there are other ways to do that too. And you don't even have to use VS Code. You can use dozens of other alternative programs in the world. 
好了，这就是全部了。就像编写 C 程序有三个步骤。你创建文件，就像使用 code 命令一样。但还有其他方法可以做到这一点。你甚至不必使用 VS Code。你可以使用世界上成百上千的其他替代程序。

You run the compiler, which, in this case, is called make. Little white lie, make's not actually the compiler, but more on that next week. But make is going to trigger compilation of this code. And the last step three is to execute, or run the program called Hello. 
你运行编译器，在这个例子中，它被称为 make。这是一个小小的谎言，make 实际上并不是编译器，下周我们会详细讨论。但 make 将会触发这段代码的编译。最后一步是执行或运行名为 Hello 的程序。

So let me go back to VS Code here. And you'll see that my code is still at the top. My terminal window is at the bottom. I hid my File Explorer, just because it's not that interesting anymore. And I'm going to do what you proposed, which was M-A-K-E space hello. All lowercase. Enter. 
让我回到 VS Code 这里。你会看到我的代码仍然在顶部。我的终端窗口在底部。我隐藏了我的文件资源管理器，因为它已经没有那么有趣了。我将执行你提出的操作，即输入 M-A-K-E 空格 hello。全部小写。回车。

And ironically, thankfully, nothing happened. And that's actually a good thing in this environment. If nothing seems to happen you probably did, good. If anything does seem to happen on the screen, you probably screwed up and you've made some mistake. So seeing nothing is generally a good thing. 
具有讽刺意味的是，幸运的是，什么都没有发生。实际上，在这个环境中这是好事。如果看起来什么都没有发生，你很可能做对了。如果屏幕上发生了任何事情，你很可能搞砸了，你犯了一些错误。所以看到什么都没有发生通常是好事。

But what has happened? Well, let me actually go back and open up my File Explorer. And notice, there's not only hello.c, but there's a second file now. Hello, which is the name of the program. So Hello is the program I want to run. 
但是发生了什么？嗯，让我实际回到我的文件资源管理器。注意，不仅有 hello.c，现在还有一个名为程序的第二个文件。Hello。所以 Hello 就是我想运行的程序。

I'm going to go back to my terminal here and to run this program, I'm going to do dot slash H-E-L-L-O. I'm going to cross my fingers, as I'll often now do, and voila, my very first program in C. 
我将回到我的终端这里，并运行这个程序，我将输入点斜杠 H-E-L-L-O。我要像现在经常做的那样，交叉我的手指，哇，我的第一个 C 语言程序。

How else can we see this file? Well, down here in my terminal window. Let me zoom in. You keep seeing dollar sign. That has nothing to do with currency. It's just a weird, geeky convention that your prompt at a terminal window, like where you type commands, generally starts with a dollar sign. Sometimes it's a hash symbol. Sometimes it's an angled bracket. It depends on the system you're on. But dollar sign is very common. It just means type your commands here. 
我们还能如何查看这个文件呢？嗯，在我的终端窗口下面。让我放大一下。你总是看到美元符号。这与货币无关。这只是终端窗口提示符的一个奇怪、极客的约定，就像你输入命令的地方，通常以美元符号开始。有时是井号符号。有时是尖括号。这取决于你的系统。但美元符号非常常见。它只是意味着在这里输入你的命令。

Well, I've typed code, I've typed make, and I've typed dot slash hello. But I can type other things too. And more on these later. Like ls, which doesn't actually spell something, but is short for list, L-I-S-T. Programmers tend to just be as succinct as they can, so most commands are not full words. They're often abbreviations. If I hit Enter now, you'll see also two things. 
嗯，我已经输入了代码，输入了 make，还输入了点斜杠 hello。但我也可以输入其他东西。关于这些内容稍后再说。比如 ls，它实际上并不拼写什么，而是 list（列表）的缩写，L-I-S-T。程序员倾向于尽可能简洁，所以大多数命令都不是完整的单词。它们通常是缩写。如果我按回车，你们会看到两件事。

You'll see hello.c. And you'll see in green, just to draw attention to it, hello as well. The asterisk here just means in the programming environment, this program is executable. Like you can actually run this by doing dot slash hello. The fact that this is just white here, that just means it's some text file. It's in fact source code. 
你们会看到 hello.c。你们还会看到绿色的 hello，这是为了引起注意。这里的星号在这里只是意味着在编程环境中，这个程序是可执行的。就像你可以通过点斜杠 hello 来实际运行它。这里只是白色，这意味着它是一个文本文件。实际上它是源代码。

So in other words, ls lists the file in my current folder. Or you can use your human eyes in the File Explorer at top left and just look at what files exist. These are one and the same. One is a GUI one, is a CLI. Graphical command line. And so forth. And we'll start to take these kinds of paradigms soon for granted. 
换句话说，ls 列出了当前文件夹中的文件。或者你可以用你的肉眼在左上角的文件资源管理器中查看有哪些文件存在。这些是一回事。一个是图形界面，一个是命令行界面。等等。我们很快就会把这些范式视为理所当然。

But let me pause here and see thus far, now that we've written our first of many C programs, any questions? Or confusion we can clear up? It's OK if you don't understand most of the lines of code. That's what today is about. Yeah. 
但让我在这里暂停一下，看看到目前为止，我们已经编写了第一个许多 C 程序，有什么问题吗？或者有什么我们可以澄清的困惑？如果你不理解大部分代码行，那没关系。今天就是要讲这个。

AUDIENCE: I don't fully understand the difference between hello and hello.c. 
观众：我不完全明白 hello 和 hello.c 之间的区别。

DAVID J. MALAN: What's the difference between hello and hello.c? So hello.c is literally my source code. It is a file that exists somewhere in the cloud that contains all of the code I myself wrote. The hello file is the file that the compiler created for me by converting the source code to the machine code. 
大卫·J·马尔安：hello 和 hello.c 有什么区别？所以 hello.c 实际上是我的源代码。这是一个存在于云中的文件，包含了我自己编写的所有代码。hello 文件是编译器为我创建的文件，它通过将源代码转换为机器代码来创建。

So inside of hello, theoretically, is a whole bunch of zeros and ones. We can't quite see them. But if I do this, let me zoom out. Let me click on hello. And notice that VS Code is going to yell at me. This file-- the file is not displayed in the text editor because it is either binary-- that is zeros and ones-- or uses an unsupported text encoding, whatever that means. 
所以在 hello 文件中，理论上，有一大堆零和一。我们看不到它们。但如果我这样做，让我放大。让我点击 hello。注意 VS Code 会提醒我。这个文件——这个文件没有在文本编辑器中显示，因为它要么是二进制文件——即零和一——要么使用了不支持的文本编码，不管那是什么意思。

If I do open it anyway, but I don't recommend this. Like heed these warnings. You won't see zeros and ones, but you will see sort of nonsense. And this is because VS Code is trying to interpret those zeros and ones incorrectly, as ASCII text, like English text. But it's not. They're instructions for the computer. 
如果我无论如何都打开它，但我不建议这样做。请留意这些警告。你不会看到零和一，但你会看到一些乱七八糟的东西。这是因为 VS Code 正在错误地尝试将那些零和一解释为 ASCII 文本，就像英文文本一样。但它们不是。它们是给计算机的指令。

So as soon as you see scary red stuff like this, like undo, close whatever tab you open, because odds are you can only break the program you just created. It's not a huge deal. You can recreate it. But that's what's inside of those files. Yeah. 
所以当你看到这种可怕的红色东西时，比如撤销，关闭你打开的任何标签页，因为很可能你只能破坏你刚刚创建的程序。这不是什么大问题。你可以重新创建它。但那些文件里就是这样。是的。

AUDIENCE: What if [? you don't ?] [INAUDIBLE]? 
观众：如果你[？不？][听不清]？

DAVID J. MALAN: Really good question. What if we don't type dot slash hello we, just type hello. Well, let me do this. Let me hide my File Explorer again because it's not that interesting here on out. I'm going to clear my terminal window by hitting Control L, just to be neat and tidy in class. Or you can literally type clear and it will clear it. But again, that's just to keep things tidy. Your TFs might do that in section 2. 
大卫·J·马兰：这是一个很好的问题。如果我们不输入点斜杠 hello，只输入 hello 会怎样呢？让我来做这个。让我再次隐藏我的文件资源管理器，因为从这里开始它就不那么有趣了。我将通过按 Control L 来清除我的终端窗口，以保持课堂上的整洁。或者你可以直接输入 clear 来清除它。但同样，这只是为了保持整洁。你们的 TFs 可能在第 2 节这样做。

If I just type Hello, enter. I'm going to get this, weirdly. Bash, hello, command not found. So more on bash down the line. But this just means literally the command hello is not found because you need to tell the computer where it is. So dot slash hello means run the hello program that is, in fact, right here. 
如果我只输入 Hello，然后回车。我会得到这个，奇怪的结果。Bash，hello，命令未找到。所以关于 bash 的内容我们稍后再说。但这实际上意味着命令 hello 没有找到，因为你需要告诉计算机它在哪。所以点斜杠 hello 意味着运行实际上就在这的 hello 程序。

By contrast, you don't run dot slash for code, for make, or other commands that we'll soon see, like ls, because why? Those are installed in the system for everyone, not just in your individual folder. So that's the difference. Any programs we write, it'll be dot slash something. 
相比之下，对于代码、make 或其他我们很快会看到的命令，如 ls，你不需要运行点斜杠，因为为什么？这些命令是系统为所有人安装的，而不仅仅是你的个人文件夹中。所以这就是区别。我们编写的任何程序，它将是点斜杠什么。

All right, so let's tease apart what is actually going on here and see if we can lean heavily today on Scratch, especially as the syntax gets weird, perhaps a little overwhelming. Still the same idea. So this last time, of course, was our Scratch program that just said Hello, world. 
好吧，让我们分析一下这里实际上发生了什么，看看我们今天是否可以大量使用 Scratch，特别是当语法变得奇怪，可能有点令人不知所措时。但理念是一样的。所以上次，当然是我们的 Scratch 程序，只说了 Hello, world。

I claim today that this is the nearest equivalent that any programmer can convert Scratch into C. If we color coded it accordingly, indeed, this sort of lines up with when green flag clicked is the orange. And then the purple is just the equivalent of the say block. So the say block, we said earlier, was a function. 
我今天声称这是任何程序员可以将 Scratch 转换为 C 语言的最接近的等效物。如果我们相应地使用颜色编码，确实，当绿色标志点击时对应的是橙色。然后紫色就是等同于说块。所以之前我们说过的说块是一个函数。

So let's compare these things side by side because there's actually some rhyme and reason to what MIT did with Scratch, as to why these shapes look like they do and so forth. So in Scratch, there's a function called say. Recall that it takes an input, otherwise known as an argument, or a parameter is another name. And that's always provided in these white ovals, zero or more white ovals. 
好吧，让我们将这些事物并排比较，因为实际上，麻省理工对 Scratch 所做的确实有一些韵律和逻辑，比如为什么这些形状看起来是这样的等等。在 Scratch 中，有一个名为 say 的函数。回想一下，它接受一个输入，也就是我们所说的参数，或者参数的另一个名称。这些参数总是以这些白色椭圆形提供，零个或多个白色椭圆形。

In C, we've already seen, but let's do it a little more pedantically, the equivalent say is essentially the word print. Why did MIT say you say? Just because it's a little more kid friendly. But print is the idea in our environment. It's actually not print, it's printf, because we're going to be able to format our text in interesting ways. More on that in a moment. 
在 C 语言中，我们已经见过，但让我们更严谨地来做，相当于 say 的词实际上是 print。为什么麻省理工说 say？只是因为它更符合儿童的语言习惯。但在我们的环境中，它实际上不是 print，而是 printf，因为我们将能够以有趣的方式格式化我们的文本。稍后我会详细介绍这一点。

But notice, the opening parentheses and closing parentheses here conjure up the idea of that white oval. So that's kind of intentional on MIT's part. What, though, in C goes between these parentheses? Well, literally the input or the argument you want to pass to the function, like Hello, world. 
但请注意，这里的开括号和闭括号引发了对那个白色椭圆形的想法。这是 MIT 有意为之的。那么，在 C 语言中，括号之间是什么呢？嗯，实际上是你想要传递给函数的输入或参数，比如“Hello, world”。

But in C, you have to be a little more pedantic because you don't have a nice little graphic like this purple block with the white oval. You have to surround everything in double quotes. Those of you with prior programming experience, in C, you need double quotes, not single quotes in this context. And then there's this arcane detail here, backslash n, which we'll come back to in just a moment. 
但在 C 语言中，你必须更加严谨，因为没有这样一个漂亮的紫色方块和白色椭圆这样的图形。你必须用双引号包围一切。那些有先前的编程经验的人，在 C 语言中，在这个上下文中你需要双引号，而不是单引号。然后这里有一个神秘的细节，即反斜杠 n，我们稍后会回来讨论。

But that's essentially what's going on, line by line from Scratch to C, there's kind of an equality between those two, even though, of course, look a little bit different. Well, let's see what that backslash n is doing, just to highlight some details here. So let me actually zoom in a little bit here and let me go up to my code. 
但本质上就是这样，从 Scratch 到 C 语言，这两者之间有一种平等，尽管当然它们看起来有些不同。让我们看看那个反斜杠 n 在这里做了什么，只是为了突出一些细节。所以让我实际放大一点，让我去我的代码那里。

And let me just recklessly delete the backslash n. I'm going to let it auto save. I'll zoom out. In my terminal window now, I'm going to run make hello to recompile the code from source code to machine code, because I changed the source code. Nothing seems to happen. That's good. 
让我鲁莽地删除反斜杠 n。我会让它自动保存。我会缩小。现在在我的终端窗口中，我将运行 make hello 来重新编译代码，因为源代码已经改变。看起来没有发生任何事情。这是好事。

Now I'm going to type dot slash hello, enter. And there's a subtle bug. Since I made that change. What looks wrong to your eye now? 
现在，我将输入点斜杠 hello，回车。有一个微小的错误。自从我做了这个改变以来，什么看起来不对劲？

AUDIENCE: The dollar sign [INAUDIBLE]. 
AUDIENCE: 美元符号[无法听清]。

DAVID J. MALAN: Yeah, the dollar sign, our so-called prompt is at the end of the line instead of on its new line. I mean, this isn't really a deal breaker. Like the code works, and you can still type a new command. But it just looks a little stupid. Like this was not the intent of the program. It's sort of good practice to move the prompt to the next line, and that's because the backslash n is what we're going to call an escape sequence. 
大卫·J·马兰：是的，美元符号，我们所说的提示符在行尾而不是在新的一行。我的意思是，这并不是一个致命的问题。代码仍然可以工作，你仍然可以输入新的命令。但这看起来有点愚蠢。这并不是程序的本意。将提示符移动到下一行是一种良好的实践，这是因为我们称之为转义序列的回车换行符。

So it turns out in programming, you have to tell the computer exactly what you want it to do. So if you want a new line, the equivalent of hitting Enter on the screen, you have to tell the computer to put a new line there. What you do not do is this. If I zoom out and I go into my code here, and I'll zoom in on the code-- if you want to put a new line, you don't do this. Why? It's just confusing for the computer. 
所以，在编程中，你必须告诉电脑你想要它做什么。所以，如果你想换行，也就是在屏幕上按 Enter 键的等效操作，你必须告诉电脑在那里放置一个新行。你不会这样做。如果我缩小并进入我的代码这里，然后我会放大代码--如果你想放置一个新行，你不会这样做。为什么？这对电脑来说只是令人困惑。

Like, wait a minute, is that a typo? Did your lines just wrap. Do you want to put a new line there. It just looks stupid. And it makes it less line based, the code itself. So humans decided years ago, if you want an actual line break, don't just naively hit the Enter key. Literally tell the computer, put a new line here. If you want to move two lines down, just do two of those. 
像是，等等，这是打字错误吗？你的行刚刚换行了。你想要在那里放一个新行吗。这看起来很愚蠢。而且它使代码本身不那么基于行。所以，多年前人类就决定，如果你想有一个真正的换行符，不要只是盲目地按回车键。实际上告诉电脑，在这里放一个新行。如果你想向下移动两行，就做两个这样的操作。

If you want three, just do three of those. Well, why the backslash? Again, these are what are called escape sequences. And you don't literally want an n, let alone [? an ?] n n. What you want is a new line, which is represented in code as simply backslash n. 
如果你想有三个，就做三个这样的操作。那么，为什么是反斜杠呢？这些被称为转义序列。你并不真的想要一个 n，更不用说[？一个？] n n。你想要的是换行符，在代码中简单地表示为反斜杠 n。

Now, for the mathematicians among you, what we're doing now by writing, using functions like printf is just sort of like f of x notation, if you recall that from high school or prior, where f is a function, x is an argument or an input thereto, and we're using parentheses in code, just like mathematicians would, to write functions like these. 
现在，对于你们这些数学家来说，我们现在通过使用像 printf 这样的函数所做的是类似于高中或之前学过的 f(x) 表示法，其中 f 是一个函数，x 是它的参数或输入，我们在代码中使用括号来编写这样的函数，就像数学家们做的那样。

And the types of functions we're using right now still follow this model. You've got input, you want output. In this case, the input to printf, for instance, just like the say block, is what's called an argument. The output, though, of the function printf is what we call a side effect. And the easiest way to think about that is a side effect is just something that sort of happens on the screen, visually, [? audibly. ?] It just sort of happens. And there's that effect on the screen. 
我们现在使用的函数类型仍然遵循这个模型。你有输入，你想要输出。在这个例子中，printf 的输入，就像 say 块一样，我们称之为参数。然而，printf 函数的输出，我们称之为副作用。最容易想到的是，副作用就是某种在屏幕上、视觉上[？听觉上。？]发生的事情。它只是发生了。这就是屏幕上的效果。

And we'll contrast this with other types of outputs from functions. But for now, we're focusing on just this, which is reminiscent, of course, of what we did last week, which is if you type Hello, world into the white oval, use the say puzzle piece, you get out the side effect of the cat appearing to have said hello, world. 
我们将与其他类型的函数输出进行对比。但就目前而言，我们只关注这一点，这当然让人联想到上周我们所做的，如果你在白色椭圆形中输入 Hello, world，使用 say 拼图块，你会得到猫似乎说了 hello, world 的副作用。

Now, as for those escape sequences in C, there's bunches of them, but very few of them will we actually use in practice. Backslash n is a new line. Backslash r is a little more subtle and it's kind of a feature of yesteryear. It moves the cursor not to the new line, but to the beginning of the line. Kind of like an old timey typewriter, if you've seen how those work. 
至于 C 语言中的转义序列，有很多种，但我们实际上在实践中只会用到其中很少一部分。反斜杠 n 是换行符。反斜杠 r 则更为微妙，它有点是过去时代的特性。它不会将光标移动到新行，而是移动到行的开头。就像一个老式的打字机，如果你见过它们是如何工作的。

Sometimes, though, you might want to print out an actual double quote. But there's a problem, of course. If this is my code here, and I'm already using double quotes as sort of special symbols to surround the text, I want printf to say it would probably be a little-- like if you wanted to say hello, world, with sort of finger quotes, why might this not be a good idea? If you think about this from the computer's perspective. 
有时，尽管如此，你可能想打印出实际的引号。但当然，有问题。如果这是我的代码，并且我已经在使用双引号作为某种特殊符号来包围文本，我希望 printf 说这可能会有一点——比如，如果你想用手指引号说 hello, world，为什么这可能不是一个好主意？如果你从计算机的角度思考这个问题。

Why is this probably not the right way to do this? Yeah? 
为什么这可能是错误的做法？嗯？

AUDIENCE: [INAUDIBLE].   观众：[听不清]。

DAVID J. MALAN: Exactly. The computer is indeed going to read your code top to bottom, left to right. And when it sees the first open quote, OK, that's fine. It understands that. But when it gets to the second quote, it's going to assume, oh, wait a minute. Maybe you only want me to say hello comma, and then it's going to keep reading and be like, wait a minute, why is there the word world here. 
大卫·J·马尔兰：确实如此。计算机确实会从上到下、从左到右读取你的代码。当它看到第一个引号时，好吧，没问题。它明白这个。但当它遇到第二个引号时，它会假设，等等，你可能只想让我说 hello 逗号，然后它会继续读取并想，等等，为什么这里会有 world 这个词。

And then wait a minute, now there's two more quotes. It's just confusing. It's ambiguous. And computers need you to be, again, very precise. So if you want a quotation mark to literally be displayed on the screen, you would escape it, so to speak, which looks a little weird and takes some getting into the habit of. 
然后等一分钟，现在又多了两个引号。这很令人困惑。它很含糊。而计算机需要你再次非常精确。所以如果你想屏幕上真的显示引号，你可以说它是逃逸的，这看起来有点奇怪，需要一段时间才能习惯。

But this just solves that kind of problem. And similarly, might you use single quotes in other contexts? More on that soon. And if you really want to bend your mind, how do you actually print a literal backslash, if you ever care to? It's not that common a character to type, but if you ever want it on the screen, it seems that we're using backslash as a special character that says, hey, give me a new line or give me a carriage return or give me a double quote. 
但这解决了这类问题。同样，在其他情况下你会使用单引号吗？很快就会详细介绍。如果你真的想挑战自己，你如何实际上打印一个字面上的反斜杠，如果你有兴趣的话？这并不是一个常见的字符来输入，但如果你想在屏幕上显示它，似乎我们使用反斜杠作为一个特殊的字符，表示，嘿，给我一个新行或者给我一个回车或者给我一个双引号。

Weirdly, in programming, if you want to type a literal backslash on the screen, you literally do backslash backslash. But that's it for sort of weirdness for now. But this is to say, humans tripped over these same problems years ago. They came up with solutions, and now we indeed have these conventions in code. 
奇怪的是，在编程中，如果你想屏幕上输入一个字面上的反斜杠，你实际上就是输入反斜杠反斜杠。但这就是现在的奇怪之处。但这是要说明，人类多年前就遇到了这些问题。他们找到了解决方案，现在我们确实在代码中有这些约定。

All right. So let's tease apart some other features of this in every program we're going to write, namely what's at the top of this file. So at the very top of this file, there is this cryptic looking hash include, or pound include standard io.h in angle bracket. So this is a little weird. We'll talk more about this next week, too. 
好的。那么让我们逐个分析我们即将编写的每个程序中的其他一些特性，特别是这个文件的顶部部分。所以在这个文件的顶部，有一个看起来很神秘的 hash include，或者说是 pound include，标准输入输出头文件 io.h，用尖括号括起来。这有点奇怪。我们下周再详细讨论这个问题。

But this is what's called a header file. Any file that ends in dot h is not a source-- well, any file that ends in dot h is what we're going to call a header file. And inside of that header file is functionality that maybe came with the system, came with the programming language itself. 
这就是所谓的头文件。任何以点 h 结尾的文件都不是源文件——或者说，任何以点 h 结尾的文件我们都会称之为头文件。而在这个头文件中包含了可能随系统或编程语言本身一起提供的功能。

So for instance, I'm going to do this. I'm going to go back to my code here and I'm going to make a very common mistake that you yourselves might make in the coming days, where I just forget that line because I don't even understand it in the first place so I certainly didn't think to type it here. 
例如，我要这样做。我要回到我的代码这里，我要犯一个非常常见的错误，你们在接下来的日子里可能会犯的，那就是我忘记写这一行，因为我一开始就不懂它，所以我当然没有在这里输入它的想法。

Now, if I go back to my terminal window after clearing it and I run make hello, because I want to recompile it because I've changed the source code, I'm going to see a fairly cryptic error. I mean, there's more error on the green than there is code up here, but you'll get the hang of reading it to try to figure out what's going on. 
现在，如果我清除终端窗口后回到它，然后运行 make hello，因为我已经更改了源代码，想要重新编译它，我会看到一个相当晦涩的错误。我的意思是，绿色的错误信息比上面的代码还要多，但你会逐渐学会阅读它，试图找出问题所在。

And I'm seeing this. Hello.c, line 3, character 5. So that just means line 3, colon, character 5. From left to right, it's sort of a visual cue as to where the problem is. Call to undeclared library function printf with type dot dot dot. And then the rest kind of overwhelms me visually at this point. 
我看到的是这个。Hello.c，第 3 行，第 5 个字符。这意味着第 3 行，冒号，第 5 个字符。从左到右，这就像一个视觉提示，告诉你问题所在。调用未声明的库函数 printf，类型为...。然后剩下的部分在这个时候对我来说视觉上有点混乱。

But that's a hint. If you do not include that header file at the top of the code you've written, you do not have access to what's generally called a library. A library is a collection of code that someone else wrote for you. Maybe it was MIT, maybe it was the authors of the C language itself years ago. Maybe it was CS50 if we wrote some code for you. 
但这是一个提示。如果你没有在编写的代码顶部包含那个头文件，你就无法访问通常所说的库。库是别人为你编写的代码集合。可能是 MIT，可能是 C 语言的作者多年前编写的。也可能是 CS50，如果我们为你编写了一些代码。

A library is a collection of code that someone else wrote for you and you access it, again, by including header files that those same people wrote for you. So if I go back to my code now-- let me clear my terminal window just to be less overwhelmed. Let me undo what I just did and put that file back. 
图书馆是别人为你编写的代码集合，你可以通过包含他们为这些代码编写的头文件来访问它。所以现在让我回到我的代码——让我清空终端窗口，这样就不会那么混乱了。让我撤销刚才的操作，把那个文件放回去。

Can you perhaps infer, just functionally, what is inside of standard io.h that, again, someone else wrote? What must be inside? Printf. So whoever invented printf decades ago probably put that code in this file. 
你能推断出标准 io.h 文件中包含什么吗？这是别人写的，里面必须有什么？是 printf。所以几十年前发明 printf 的人可能把这段代码放进了这个文件里。

And so by including it, so to speak, in my code, I now have access to printf functionality. So that's all. And again, C is lower level than scratch. It's obviously text based, which means you have to be a little more pedantic yourself as to what you want the computer to do for you. And if you want to use someone else's code, you indeed have to include it. 
所以说，通过包含它，我的代码现在可以访问 printf 功能。就这样。再次强调，C 语言比 scratch 更底层。它显然是基于文本的，这意味着你必须更细致地考虑你想要计算机为你做什么。如果你想使用别人的代码，你确实需要包含它。

Scratch didn't bother with this, but we indeed do need to do this in the context of C. As an aside, just to preempt some unnecessary headaches, this word is not studio.h. Every year, a non-zero number of people can't understand why their code is not working because studio.h is not found. It's standard io, stdio.h. That's one of the first frequently made mistakes otherwise. 
Scratch 没有考虑这个问题，但在 C 语言的环境中我们确实需要这样做。顺便说一句，为了避免一些不必要的麻烦，这个词不是 studio.h。每年都有一些人无法理解为什么他们的代码不起作用，因为找不到 studio.h。它是 standard io，stdio.h。这是经常犯的第一个错误之一。

All right, so remember that. Let me undo now the unnecessary quotes I added here. And let me propose that we show you where you can learn more. So all of these libraries generally are documented. People wrote instructions for how to use them. 
好吧，记住这一点。现在让我撤销这里添加的不必要的引号。让我提出一个建议，我们可以告诉你去哪里了解更多。所以所有这些库通常都有文档。人们写了使用说明。

So you don't just have to listen and pay attention only in class. You don't have to pull up a book. There tends to be online documentation as well. For instance, for the standard I/O header file. And the documentation in the world of programming for C specifically are called manual pages or man pages for short. 
你不必只在课堂上听讲和注意。你不必翻阅书籍。通常还有在线文档。例如，对于标准 I/O 头文件。在 C 语言编程的世界中，这些文档被称为手册页或简称为 man 页。

Unfortunately, they're really written decades ago for the more comfortable among you, those who have an eye already for programming. And so what CS50 has done at this URL, manual.cs50.io, is we essentially have more user friendly versions of the documentation for this header file and others. 
不幸的是，这些文档是几十年前为那些编程有经验的你们所写的。因此，CS50 在这个网址，manual.cs50.io，提供了这个头文件以及其他文档的更用户友好的版本。

So for instance, if I pull up manual.cs50.io, you'll see a web page like this. And if I just scroll quickly, you'll see a whole bunch of header files, .h files, and a whole bunch of functions beneath them. And there's only a couple of dozen or so here. And indeed, per this checkbox at the top frequently used in CS50, we have highlighted the functions that odds are over the next month and a half like you will probably want to use. 
例如，如果我打开 manual.cs50.io，你会看到一个这样的网页。如果我快速滚动，你会看到一大堆头文件，.h 文件，以及它们下面的许多函数。这里只有二三十个。而且，根据 CS50 顶部这个复选框，我们突出显示了未来一个半月内你可能想要使用的函数。

If I turn off that less comfortable mode, there's actually hundreds of functions that come with C. And like no programmer knows all of these functions. What they do is they read the manual when they want to find some new piece of functionality. So I'm going to simplify this. I'm going to scroll down, though, to stdio.h, for instance here, and you'll see more functions that we'll eventually get to. But if I click on printf, you'll see hopefully some fairly user friendly instructions for how this thing works. 
如果我关闭那个不太舒适的模式，实际上 C 语言有数百个功能。而且没有程序员知道所有这些功能。他们的做法是在需要找到一些新功能时阅读手册。所以我要简化这个。不过，我会向下滚动，比如到 stdio.h 这里，你会看到我们最终会涉及到的更多函数。但如果我点击 printf，你可能会看到一些关于这个功能如何工作的相当用户友好的说明。

For instance, under synopsis, you'll see that we tell you what header file you should include in order to use it. Below that is something called a prototype. More on that later. But below that is a description. And here is where the CS50 staff have written in layperson's terms explanations of how this function works, how to use it, and so forth. 
例如，在概要部分，你会看到我们告诉你应该包含哪个头文件才能使用它。下面是所谓的原型。稍后再详细说明。但下面是描述。在这里，CS50 团队用通俗易懂的语言解释了这个函数的工作原理、如何使用等等。

But if you'd rather see what the real world uses, you can turn off that mode and you'll see much more arcanely the original language. So in short, these are sort of training wheels that you can turn on and off at your leisure. But ultimately, this is real world documentation as well. 
但如果你更想看到现实世界的使用情况，你可以关闭那个模式，你会看到更多原始语言的神秘之处。简而言之，这些就像是你可以随意开启或关闭的训练轮。但最终，这也是现实世界的文档。

So if we want to see something else, for instance, let me go back to the main menu. And as we'll see today, there are actually functions in a header file called cs50.h that for a few weeks, we're going to lean on heavily. Long story short, it's actually kind of hard. It's annoying in C to get user input, ironically, to get the human to type in a word or a number. You have to jump through some technical hoops to make that happen. 
因此，如果我们想看到其他内容，比如，让我回到主菜单。正如我们今天将要看到的，实际上在名为 cs50.h 的头文件中存在一些功能，在接下来的几周里，我们将要大量依赖它们。简而言之，这实际上相当困难。在 C 语言中获取用户输入，讽刺的是，让人类输入一个单词或数字，你必须跳过一些技术障碍才能实现这一点。

And we'll show you how to do it like the real way in a few weeks. But for now, among the first training wheels is a CS50 library code that we wrote that will just make your life easier. And indeed, we're going to give you access to functions that simplify the process of actually getting input from the user. So case in point, we're going to give you access to functions like get_string, when you want to get a string of text from the user-- a string is just text. So if you want to get one character, one word, one sentence, one paragraph, you can call a function called get_string. 
我们将在几周内向您展示如何真正地这样做。但就目前而言，作为第一个训练轮子之一的是我们编写的 CS50 库代码，这将使您的生活更加轻松。的确，我们将为您提供简化从用户获取输入过程的函数。以案例为证，我们将为您提供访问 get_string 等函数的权限，当您需要从用户那里获取一段文本时——文本就是文字。所以，如果您想获取一个字符、一个单词、一个句子或一个段落，您可以调用 get_string 函数。

We're going to give you another one called get_int. When you want to get an integer from the user, like 1 or 0 or negative 1 or anything else, you can use that function as well. And we'll see today too there's other functions you can use from CS50's library. In a weeks' time, we'll take these away once you don't need them anymore. And you'll see what those library functions have been doing all along for you. 
我们将再给你一个名为 get_int 的函数。当你想从用户那里获取一个整数，比如 1、0、-1 或其他任何东西时，你同样可以使用这个函数。今天我们也会看到，你还可以从 CS50 的库中使用其他函数。一周后，当你不再需要它们时，我们会把这些函数拿走。你也会看到这些库函数一直在为你做什么。

But for now, let's focus on this. Perhaps the most useful of them, get_string, and solve a problem that we did already pretty easily in Scratch. So recall in Scratch, this was a program that used two functions. Three, in fact. 
但现在，让我们专注于这个。也许最有用的就是 get_string，它可以解决我们在 Scratch 中已经非常容易解决的问题。回想一下，在 Scratch 中，这是一个使用了两个函数的程序——实际上是有三个。

Ask, to ask a question of the user. Say, to actually display something on the screen. And join, to combine the default of apple, banana. Or in this case, Hello, and whatever the human's answer was. So this made our Hello program a little more interactive last time. How can we actually translate this into a similar paradigm now? 
询问，用于向用户提问。显示，用于在屏幕上实际显示某些内容。还有合并，比如将苹果和香蕉的默认值合并。或者在这种情况下，你好，以及人类给出的任何回答。这使得我们上次的好程序变得更加互动。现在我们如何真正实现这种范式呢？

So input and output is the story, as always. In this case, we have arguments going into those functions. But now we're going to introduce not side effects, which is stuff that happens visually. We're going to revisit that blue circle called answer, or the blue oval called answer, that represented last week what we called a return value. And this is what many functions will actually do for us. They're not just going to display something presumptuously on the screen or play a sound or a video or something like that. They're going to hand you back virtually a value-- text or integers or sounds or images that you can then do with what you see fit. 
输入和输出一直是故事。在这种情况下，我们有参数传入这些函数。但现在我们将介绍的不是副作用，即那些视觉上的东西。我们将重新审视上周提到的蓝色圆圈“答案”，或者蓝色椭圆形“答案”，它代表了我们所说的返回值。许多函数实际上会为我们做这件事。它们不会只是自以为是地在屏幕上显示某些内容，或者播放声音、视频等。它们会给你一个虚拟的值——文本、整数、声音或图像，你可以根据需要处理这些内容。

So the paradigm we'll now have is much like in Scratch. If the input is what's your name and the function is ask, and you get back a return value of answer, we want to actually do this now in C. So side by side, what code like this in Scratch is going to look like today onward is this. 
因此，我们现在将要采用的范例将类似于 Scratch。如果输入是“你叫什么名字”，函数是 ask，你得到一个返回值 answer，我们希望现在就在 C 语言中实现这个功能。所以，从今天开始，与 Scratch 中类似的代码将看起来像这样。

Instead of using the Ask block, you literally use CS50's function called get_string. It takes input. So we put the parentheses on the left and the right to conjure the idea of this white oval. Inside of that string, you can put a prompt, so to speak, like, what do you want the human to be asked, in this case. And I'm missing something still. Per the placeholders here, what's missing? 
而不是使用 Ask 块，你实际上使用 CS50 的 get_string 函数。它接受输入。所以我们把括号放在左边和右边，以唤起这个白色椭圆形的概念。在这个字符串中，你可以放入一个提示，比如说，你想让人类被问到什么，在这个例子中。但我还缺少一些东西。根据这里的占位符，缺少的是什么？

So quotation marks, so literally quotation marks on the left and the right. And I'm going to be a little anal here. I'm going to put a space at the end. Because I don't want to-- I could, but I don't want the cursor to go to the next line. Hence, no backslash n. 
所以引号，所以左边和右边的引号。我会稍微严格一点。我会在末尾放一个空格。因为我不想——我可以，但我不想光标跳到下一行。所以没有反斜杠 n。

If I want the cursor just to sit there kind of blinking, waiting for the user after the question mark, I'm just going to put a space. So it will stay there for me. But this is just an aesthetic detail using the same idea as before. So that is the analog of this block. But how do I get access to the so-called return value? 
如果我想让光标在那里静止不动，像等待用户在问号后面一样闪烁，我只需要放一个空格。这样它就会为我停留。但这只是一个使用之前相同想法的美学细节。所以这就是这个块的对等物。但我是如何获取所谓的返回值的呢？

MIT just plopped it on the screen for us automatically. In C, we have to write a little more code to get access to that return value. And the way we do this is on the left hand side of this line of code, we come up with a name for the return value. You can call it anything you want. But answer is a nice equivalent to what MIT did. 
麻省理工为我们自动将这个值放在了屏幕上。在 C 语言中，我们需要写更多的代码来获取这个返回值。我们这样做是在代码的左侧，为返回值起一个名字。你可以叫它任何你想要的。但"answer"是一个很好的等价词，就像麻省理工所做的那样。

You could more generically call it x or y or z. But that's not really useful. And so computer scientists, unlike mathematicians, will tend to use variables that are a little more verbose, like the word "answer." But in C, it's, again, a little lower level. You have to tell the computer what type of variable this is going to be. 
你也可以更通用地称之为 x、y 或 z。但这并不真正有用。因此，与数学家不同，计算机科学家倾向于使用更冗长的变量名，比如"answer"。但在 C 语言中，这又是一个更底层的概念。你必须告诉计算机这个变量的类型。

So I'm kind of conflating "variable" and "return value," but they're being used in an intertwined way. The get_string function, just like the ask block, returns a value. If you want to do something with it, you need to put it in something called a variable, which is denoted in text here. 
所以我有点把“变量”和“返回值”混淆了，但它们是以交织的方式被使用的。get_string 函数，就像 ask 块一样，返回一个值。如果你想用它做些什么，你需要把它放在一个叫做变量的东西里，这里用文本表示。

But again, per last week, the computer doesn't know if it's looking at numbers or characters or images or sounds. You have to tell it, as the programmer, that the zeros and ones that are somehow involved here underneath the computer's hood are, in fact, to be treated as text, a.k.a. string. 
但同样，和上周一样，计算机不知道它看到的是数字、字符、图像还是声音。你必须告诉它，作为程序员，这些在计算机内部 somehow 涉及的零和一实际上是文本，也就是字符串。

Now, there's one stupid subtlety still missing from this line of code. Does anyone know, especially if you've programmed-- OK, all of you have program before. Yes? 
现在，这段代码中还有一个愚蠢的细节还没提到。有人知道吗，尤其是如果你编程过——好吧，你们都编程过。是的吗？

AUDIENCE: Semicolon.   观众：分号。

DAVID J. MALAN: Semicolon. So one of the headaches of C and a lot of languages is you actually have to finish your thought explicitly so the computer knows that that line of code is done. And it's not a period, like in English. It's, in fact, a semicolon. 
DAVID J. MALAN: 分号。C 语言以及许多语言的头痛之处在于，你必须明确地结束你的想法，这样计算机才知道这一行代码已经完成。它不是一个句号，就像英语中的那样。实际上，是一个分号。

Now, you don't use these everywhere. We'll see where you use them. But that, too, is a very common mistake, to overlook something simple. But again, in the coming weeks, even though this might look very cryptic, with muscle memory and practice, you'll start to see these things instantly, even if, for a few days, you sort of bang your head against the screen, so to speak, not seeing what the TFs and I much more readily see. 
现在，你不必到处都使用这些。我们会看到在哪里使用它们。但这也是一个非常常见的错误，就是忽略一些简单的东西。但同样，在接下来的几周里，尽管这看起来可能非常晦涩难懂，但随着肌肉记忆和实践，你将开始瞬间看到这些事情，即使在你几天内似乎在屏幕上撞得头昏脑胀，从某种程度上说，看不到 TFs 和我更愿意看到的东西。

So let's go ahead and do this. Let me go back over to VS Code here. Let me zoom in just a little bit. And let me go ahead and do this. I'm going to get rid of my single use of printf. And I'm going to say the exact same thing-- string answer equals get string, quote, unquote, "What's your name?" question mark, space, closed quote, semicolon. And now I want to print out that answer. 
所以我们来做这件事吧。让我回到 VS Code 这里。让我稍微放大一点。然后我继续做这件事。我要去掉我的单次使用 printf。我要说完全一样的话-- string answer = get string, "What's your name?" 空格，关闭引号，分号。现在我想打印出这个答案。

Well, let me do this incorrectly, deliberately, for the moment. Let me just say printf, quote, unquote, "hello, answer," if I want to plug in "answer" and I want to add a new line at the end, semicolon. So let me try this. But there's multiple mistakes now in my code. Let's trip over them deliberately. 
嗯，让我此刻故意错误地做这件事。让我只说 printf，引号，不引号，“hello, answer，”如果我想插入“answer”并想在末尾添加一个新行，分号。所以让我试试。但现在我的代码里有多处错误。让我们故意犯这些错误。

Let me go down to my terminal window by clicking at the bottom of the screen. Let me run "make hello" again. Enter. And, oh, my god, there's even more errors now than there were before, but not a problem. 
让我点击屏幕底部进入终端窗口。让我再次运行“make hello”。输入。哦，天哪，现在错误比之前还多，但没问题。

Let me click on this little triangle here, which is just going to zoom in on the terminal window. So it takes up my full screen. And just generally, all you have to do is find a few keywords visually that give you a clue as to what's going on. Or, as before, you can always ask the CS50 Duck. 
让我点击这里的小三角形，它将放大终端窗口。所以它会占据我的整个屏幕。一般来说，你只需要找到几个关键词，从视觉上了解发生了什么。或者，就像之前一样，你总是可以询问 CS50 鸭。

So here's the command I ran, "make hello." Somehow that induced all of these errors. Always read them top to bottom, not bottom up. So from top to bottom, there's a problem on line 5, character 5-- use of undeclared identifier string. Did I mean standard in? No, no, no, I didn't there. 
所以这是我所运行的命令，“make hello.”不知为何引发了所有这些错误。总是从上到下阅读它们，而不是从下到上。所以从上到下，第 5 行第 5 个字符有问题--使用了未声明的标识符 string。我是不是想指标准输入？不，不，不，我不是那个意思。

And then, also, two errors generated. Too many errors [? are made. ?] What did I do wrong? Well, it turns out what I do need to do at the top of this file-- let me click the triangle to zoom back out-- if I want to use the get_string function to get a string, I actually need to include another header file, which is probably called "include cs50.h." 
然后，也产生了两个错误。错误太多[？都犯了。？]我到底做错了什么？结果是我确实需要在文件顶部做这件事——让我点击三角形来缩小视图——如果我想使用 get_string 函数获取字符串，我实际上需要包含另一个头文件，可能叫做"include cs50.h。"

Technically, any order is fine. I tend to alphabetize because I just know, therefore, where to look alphabetically for a certain header file. Now that that's in place, let me again run "make hello." Enter. And now we're back in business. No error message. 
从技术上讲，任何顺序都可以。我倾向于按字母顺序排列，因为我知道，因此，可以在字母顺序中查找特定的头文件。现在，这个已经到位了，让我再次运行"make hello。"回车。现在我们又回到正轨了。没有错误信息。

So even though you might have more errors than you have code, odds are it's just the computer is confused. And it could be something simple and an easy fix like that. So just to be clear, standard io.h, because I'm including it, I can use printf. cs50.h, I can use get_string because the people who invented C and the people who invented CS50 wrote those two files, so to speak, respectively. 
所以即使你的错误可能比你的代码还多，但很可能是计算机搞混了。这可能只是一个简单且容易修复的错误。所以为了明确起见，因为我包含了 standard io.h，所以我可以使用 printf。我可以使用 cs50.h 中的 get_string，因为 C 语言的创造者和 CS50 的创造者分别编写了这两个文件，可以说。

All right, unfortunately, even though the program compiles, that doesn't mean it's correct. It just means it's syntactically valid. It's valid C code. 
好吧，不幸的是，即使程序可以编译，这也并不意味着它是正确的。这只意味着它是语法上有效的。这是有效的 C 代码。

If I go ahead and run "./hello" and hit Enter now, I'm going to be prompted for my name. So I'll type it-- D-A-V-I-D. And notice there's a space to the right of the question mark, as promised. Enter. But it just says "hello, answer," which, of course, is not the intent. I want it to say "hello, David." 
如果我现在运行 "./hello" 并按回车，将会提示我输入我的名字。所以我将输入它-- D-A-V-I-D。注意，问号右边有一个空格，正如之前所承诺的。回车。但它只显示 "hello, answer"，这当然不是我的意图。我想让它显示 "hello, David"。

So how can we do this? Well, in Scratch, it took a couple of puzzle pieces. But it was pretty straightforward. If I wanted to say the combination of two phrases, "hello" and something else, I joined those two and then passed that output to the input of say. In C, it's going to be a little different here just because it's an old language and this is how it's done. 
那么，我们该如何做呢？在 Scratch 中，这需要几个拼图块。但这是相当直接的。如果我想说出两个短语的组合，"hello" 和其他什么，我将这两个短语连接起来，然后将输出传递给 say 的输入。在 C 语言中，这会有些不同，因为这是一种旧语言，这就是它的做法。

Still use printf because that's the same thing as say. I got my parentheses. I got my semicolon. Good to go. But inside of that, this is where printf is different. 
仍然使用 printf，因为这与 say 相同。我有了我的括号。我有了我的分号。一切就绪。但在那里面，这就是 printf 的不同之处。

If you want to say something followed by something else, in the world of C, you tend to use placeholders. So you don't just join things together as we will do in Python and other languages. You say to the compiler, give me the word "hello," comma, and then something else. And the percent s means, put another string here. It's sort of like leaving a placeholder in your code or a template where you'll actually plug in some values. 
如果你想说一些话，然后紧接着说另一些话，在 C 语言的世界里，你通常会使用占位符。所以你不会像在 Python 和其他语言中那样直接将它们连接起来。你会告诉编译器，给我单词"hello"，逗号，然后是其他内容。这里的百分号 s 表示，在这里放另一个字符串。这就像在你的代码或模板中留下一个占位符，你实际上会插入一些值。

Now, if this is what I want to display, I still use my quotes, as before. And I might, in fact, have a backslash n if I want to move the cursor to the next line. But this is where printf is a little different. 
现在，如果我想显示这个，我仍然使用我的引号，就像之前一样。实际上，如果我想将光标移动到下一行，我可能会有一个反斜杠 n。但这就是 printf 有点不同的地方。

Unlike say, which took one input, printf is kind of like join. It can take two or more inputs if you so choose. You just have to separate them with a comma. 
与之不同，say 只接受一个输入，printf 有点像 join。如果你选择，它可以接受两个或更多的输入。你只需要用逗号将它们分开。

So much like the join block has two ovals here that are initially white-- apple and banana-- until we dragged and dropped answer on top of it, printf-- and really any function in C-- if you want to pass in multiple inputs, that's fine if they're supported. Just separate them with commas. There's no multiple parentheses. There's no multiple ovals. Just separate them with commas. 
所以，就像连接块在这里有两个初始为白色的椭圆形——苹果和香蕉——直到我们将答案拖放到它上面，printf——以及 C 语言中的任何函数——如果你想传入多个输入，如果它们被支持，那就没问题。只需用逗号分隔它们。没有多个括号。没有多个椭圆形。只需用逗号分隔它们。

And now notice a potential point of confusion. What's different about this comma and this one, just instinctively? Sort of minor detail, but important. Yeah? 
现在注意一个潜在的混淆点。这个逗号和那个逗号有什么不同，仅仅是直觉上的吗？这算是一个小细节，但很重要。是吗？

AUDIENCE: Inside and outside. 
观众：内部和外部。

DAVID J. MALAN: So one is inside, one is outside. So the one that's inside the quotes is literally the English grammatical comma that you want the human to see. The one out here is a C thing that's separating the first input to this function printf from the second. Strictly speaking, you don't need a space there. But it's a good practice, stylistically, to separate your arguments with single spaces, just as I've done there. 
大卫·J·马兰：一个是内部，一个是外部。所以，在引号内的那个是你要人类看到的真正的英语语法逗号。这里的这个是 C 语言中的分隔符，用于分隔这个函数 printf 的第一个输入和第二个输入。严格来说，那里不需要空格。但从风格上讲，用单个空格分隔你的参数是个好习惯，就像我刚才做的那样。

So let me go ahead and now do something with this. Let me go back to my C code here. I'm going to clear my terminal window just to get rid of that distraction. And now I'm going to change answer to percent s. 
让我先做点事情。让我回到我的 C 代码这里。我要清空我的终端窗口，以消除那个干扰。现在我要把 answer 改为 percent s。

And then outside of the double quotes on line 7, I'm going to do comma "answer." And then, after it auto-saves, I'm going to go back to my terminal window. And just to make another deliberate mistake, "./hello." Enter. "What's your name? David." Enter. 
然后在第 7 行的双引号外面，我将输入一个逗号“答案”。然后，在它自动保存后，我将回到我的终端窗口。为了犯另一个故意的错误，“./hello.” 回车。 “你叫什么名字？大卫。” 回车。

It's still broken. But why? I still have to recompile it. So again, you just get into the habit, when you change your code, you have to recompile so you get new machine code in the file "hello." 
它仍然坏了。但是为什么？我仍然需要重新编译它。所以，再次提醒，当你更改代码时，你必须重新编译，以便在“hello”文件中获得新的机器代码。

So let's do it again. "make hello." No errors is good. "./hello." Enter. "What's your name?" again. D-A-V-I-D. And now, "hello, David." 
所以让我们再试一次。 "make hello。" 没有错误是好的。 "./hello。" 输入。 "你叫什么名字？" 再来一次。 D-A-V-I-D。现在，“你好，大卫。”

So again, a lot of this is still cryptic. But it's going to start to follow patterns like this. Functions like in math class, f of x, are written function name, parentheses, input, comma, input, comma, input, however many you have. They're going to follow these patterns. But notice, too, on lines 6 and 7, I have finished each of my thoughts with a semicolon. 
所以，这些内容仍然很晦涩。但它们将开始遵循这样的模式。像数学课上的函数一样，f(x)，它们的写法是函数名，括号，输入，逗号，输入，逗号，输入，有多少个就写多少个。它们将遵循这些模式。但请注意，在第 6 行和第 7 行，我已经用分号结束了我的每一个想法。

So what are the other commands that you can run in your terminal window besides something like ls? Well, it turns out there's a whole bunch of them. ls, of course, was simply short for list, which shows you the files in your current folder. But there's also cd for change directory, which is the command equivalent of double-clicking on a folder to open it up in a graphical environment. 
那么，除了像 ls 这样的命令之外，你还可以在终端窗口中运行哪些命令呢？实际上有很多。当然，ls 只是 list 的缩写，它显示了当前文件夹中的文件。还有 cd，代表更改目录，这是在图形环境中双击文件夹以打开它的命令等效。

There's cp, which is short for copy, which allows you to make a copy of a file or folder. There's make dir, "mkdir," which is short for make directory, which is how you could make a new folder. There's mv, which is short for move, which would allow you to move one file or folder from one place to another or simply rename one of those to a different name. 
还有 cp，代表复制，允许你复制文件或文件夹。有 make dir，即 mkdir，代表创建目录，这是创建新文件夹的方法。还有 mv，代表移动，允许你将一个文件或文件夹从一个地方移动到另一个地方，或者简单地将其重命名为不同的名称。

There's rm, which is short for remove. And there's "rmdir," which is short for remove directory. So, in fact, let's play around with a couple of these. Let me go back to VS Code here. Let me go ahead and open up my File Explorer. And recall that at this point I've got two files, hello.c, which contains my source code, and then hello, which contains my machine code, the executable program that I previously generated by running make. 
有 rm，它是 remove 的缩写。还有“rmdir”，它是 remove directory 的缩写。所以，实际上让我们来玩玩这些命令。让我回到 VS Code 这里。让我打开我的文件资源管理器。回想一下，到现在为止，我这里有两个文件，hello.c，它包含我的源代码，然后是 hello，它包含我的机器代码，也就是我之前通过运行 make 生成的可执行程序。

Well, let me go ahead and propose that I'd like to prepare to keep all of my files and folders very orderly. So for every program I write or for every problem on a problem set I write, maybe I want to store my relevant files in a specific folder for that problem. 
好吧，让我先提出一个想法，我想把所有的文件和文件夹都保持得非常有序。所以，对于我写的每一个程序，或者对于我写的每一个问题集上的问题，也许我想把相关的文件存储在为该问题指定的特定文件夹中。

So suppose then that I want to put hello.c in a folder, otherwise known as a directory, called hello. Well, I can't do that quite yet because I already have a program called hello. So let me use one of those new commands. rm space hello will delete or remove hello from my current directory. 
假设我想把 hello.c 放在一个文件夹里，也就是目录，叫做 hello。但是我现在还不能这么做，因为我已经有一个叫 hello 的程序了。所以让我使用一个新命令。rm 空格 hello 将会删除或从我的当前目录中移除 hello。

So I'm going to hit Enter. I'm going to be prompted to confirm with y for yes or n for no. "Remove regular file 'hello'?" I'm going to hit y and enter. And as I hit Enter, watch the top left of my screen as the hello file would seem to disappear. Voila, it's now gone. 
因此我将按下 Enter 键。我将被提示确认，输入 y 表示是，输入 n 表示否。“删除常规文件‘hello’？”我将按下 y 键并回车。当我按下 Enter 键时，请观察屏幕的左上角，hello 文件似乎消失了。哇，它现在不见了。

So now I'm going to go ahead and use a different command. Let me go ahead and do mkdir for make directory. I'm going to call the directory itself hello. And watch again, at top left, what happens. Enter. Now I have not a file but a folder called hello. 
现在我将使用不同的命令。让我先执行 mkdir 命令来创建目录。我将把目录命名为 hello。再次观察屏幕左上角会发生什么。回车。现在我有一个名为 hello 的文件夹，而不是文件。

And in this GUI, the fact that it's a folder is indicated, one, by its icon and, two, by that little right-facing triangle, which means I can expand it to see what's inside. And in fact, if I do that, I'll see, of course, that nothing's in it because we literally just created it. 
在这个 GUI 中，它是一个文件夹的事实通过以下两点表示：一是它的图标，二是那个指向右边的三角形，这意味着我可以展开它来查看里面的内容。实际上，如果我这样做，我会看到，当然，里面什么都没有，因为我们刚刚才创建它。

All right, well, what if I want to move hello.c into the new hello folder? Well, I could, just like on macOS or Windows. I could, actually in my File Explorer, click and drag one into the other. But let's do this entirely within the terminal window. 
好吧，那么，如果我想要把 hello.c 移动到新的 hello 文件夹里怎么办？嗯，我可以，就像在 macOS 或 Windows 上一样。实际上，我可以在我的文件资源管理器中点击并拖动一个到另一个。但让我们完全在终端窗口中完成这个操作。

So let me do this. Let me move, or mv for short, my file called hello.c into a new destination folder, hello. And I can, optionally, put at slash the end of "hello" just to make super clear that it's a directory. But that's not strictly necessary. 
让我来试试。让我移动，或者用缩写 mv，我的文件 hello.c 到新的目标文件夹 hello。我可以，可选地，在"hello"后面加上斜杠，以使它对用户来说非常清楚，它是一个目录。但这并不是必需的。

But if I say mv hello.c hello, with spaces in between, assuming hello exists as a folder, watch what happens at top left now. It's a little more subtle, but hello.c is going to move inside of the hello folder right now. And indeed, it's only slightly more indented. But notice if I collapse the hello folder, notice that it seems to be gone because hello.c is now inside of that folder. 
但是，如果我输入 mv hello.c hello，中间有空格，假设 hello 已经是一个文件夹，看看现在左上角发生了什么。这有点微妙，但 hello.c 现在会移动到 hello 文件夹中。确实，它只是稍微缩进了一点。但注意，如果我折叠 hello 文件夹，看起来它好像消失了，因为 hello.c 现在在文件夹里。

Of course, if I expand that, I'll see it again. If I go back to my terminal window and type ls for list, now I don't see hello.c. And I don't see an executable program anymore. But I do see hello. And the slash there just makes super clear to me, the user, that it's indeed a folder. 
当然，如果我展开它，我还会看到它。如果我回到我的终端窗口并输入 ls 来列出内容，现在我不会看到 hello.c。而且我不再看到一个可执行程序。但我确实看到了 hello。那里的斜杠只是清楚地告诉我，用户，它确实是一个文件夹。

So how do I change into that folder? Well, I can obviously use the graphical interface at left and click and expand and see what's going on. But there's no direct connection between the File Explorer at top left and my terminal window at bottom right. Rather, those are just two different ways to explore the underlying system. 
那么，我该如何切换到那个文件夹呢？显然，我可以用左侧的图形界面点击并展开，看看发生了什么。但是，左上角的文件资源管理器和右下角的终端窗口之间没有直接的联系。相反，这只是两种不同的方式来探索底层系统。

So if I want to change my terminal window into this new directory, I can do cd for change directory, hello, and then Enter. And now notice my terminal window's prompt changes slightly. There's still a dollar sign, which indicates, type my commands here. 
如果我想将终端窗口切换到这个新目录，我可以使用 cd 命令来更改目录，输入 hello，然后按 Enter 键。现在注意，我的终端窗口的提示符略有变化。仍然有一个美元符号，表示在这里输入我的命令。

But before that dollar sign, just so that I have a reminder, sort of breadcrumbs that visually remind me what folder I am now in, I see that I'm inside of hello. If I now type ls, I should see the file I expect to be in there, which is indeed hello.c. 
但在美元符号之前，为了提醒自己，就像一种视觉上的路径提示，我可以看到我现在在 hello 文件夹内。如果我现在输入 ls 命令，我应该能看到我期望在这个文件夹中的文件，确实就是 hello.c。

Now, suppose I want to try out some of those other commands. And suppose I want to maybe rename this file. I really want this file to be called something else. So maybe I might do something like this, mv hello.c space, and now a new name for the file. 
现在，假设我想尝试一些其他的命令。假设我想重命名这个文件。我真的希望这个文件有另一个名字。所以，我可能会这样做，mv hello.c space，现在文件有了新的名字。

Well, maybe I want to make-- say this is an old version of my code, because I want to just start fresh with something new. So I could do something like this, mv hello.c old.c. And watch what happens at top left. hello.c, of course, gets renamed via the move command. So I can use move to move a file into a folder. Or I can use it to rename a file or folder, as I've just done here. 
嗯，也许我想重新开始，比如说这是我的旧代码版本。所以我可以这样做，将 hello.c 重命名为 old.c。然后看看左上角发生了什么。当然，hello.c 会通过移动命令被重命名。所以我可以使用移动命令将文件移动到文件夹中。或者，我可以用它来重命名文件或文件夹，就像我刚才做的那样。

Now, suppose I want to undo that. Well, I can't just type undo. I can't just hit Control C. But I can do the opposite, in effect. mv old.c hello.c will now, per top left, change it back into that file. 
现在，假设我想撤销这个操作。我不能只输入 undo，也不能只按 Ctrl+C。但我可以执行相反的操作。将 old.c 重命名为 hello.c 现在会，如左上角所示，将其改回那个文件。

If I want to make a copy of this file, maybe as an actual backup because I'm really happy with this version and I'm worried about breaking it, well, I could do cp for short. I can then do hello.c. And then I can do something like backup.c, or any other file name. 
如果我想复制这个文件，也许作为实际的备份，因为我真的很喜欢这个版本，担心会弄坏它，嗯，我可以使用 cp 作为简称。然后我可以做 hello.c。然后我可以做类似 backup.c 的文件，或者任何其他文件名。

I'm taking care to use the same file extension so that if I do open this file later, it still opens and gets highlighted and colorized in the same way. But watch what happens now at top left. When I type Enter, I now have two files in this hello folder. And indeed, if I type ls now, I can see exactly the same. 
我特别注意使用相同的文件扩展名，这样如果以后再打开这个文件，它仍然可以以相同的方式打开并高亮显示。但现在看看左上角发生了什么。当我输入 Enter 时，现在这个 hello 文件夹里就有两个文件了。确实，如果我现在输入 ls，我可以看到完全一样的情况。

So long story short, there's this whole list of commands, and even more than these, that allow you to manipulate the underlying system in exactly the same way that you and I have probably done for years by using a mouse and pointing and clicking and double-clicking. But for now, let's undo all of this because I haven't really written that many programs today. And I'm going to keep things simple today and keep everything in my same folder. 
简而言之，有一长串命令，甚至比这些还多，可以让你以完全相同的方式操作底层系统，就像我们可能多年来通过使用鼠标点击和双击来做到的那样。但现在，让我们撤销所有这些操作，因为我今天并没有真正写很多程序。今天我会保持简单，把所有东西都放在同一个文件夹里。

So let's undo all of this. Let me go ahead and now remove backup.c because I don't particularly care about that. I'm going to be prompted to confirm as much. Then let me go ahead and move hello.c out of this folder and into the original folder. 
让我们撤销所有这些操作。让我先删除 backup.c，因为我并不特别关心它。我会被提示确认。然后让我把 hello.c 从这个文件夹移动到原始文件夹中。

And, conceptually, the original folder is what we would call the parent folder, the folder that contains this hello folder. And the way you can specify the parent folder, like back up from whence you came, is with dot dot. So a single dot, as we've actually seen "./hello", "./a.out" means execute a program in this directory, dot. But dot dot refers to your parent directory. 
在概念上，原始文件夹就是我们所说的父文件夹，包含这个 hello 文件夹的那个文件夹。你可以用点号点号（..）来指定父文件夹，就像备份你来的地方一样。所以一个点号，正如我们实际看到的"./hello"，"./a.out"表示在这个目录中执行程序，点号。但点号点号指的是你的父目录。

So watch what happens at top left when I move this hello.c file out of this folder. It shifts a little bit to the left to indicate that it's no longer in that folder. I'm going to go ahead and type cd dot dot, which will bring me back to my parent folder. 
看看当我把这个 hello.c 文件从这个文件夹移出时，左上角会发生什么。它会稍微向左移动，表示它不再在那个文件夹里了。我将输入 cd ..，这将把我带回到父文件夹。

Or, even more useful, especially if you get confused or lost somewhere within your folders, you can actually just type cd and nothing, and that will whisk you back to that original folder no matter where you are. So it's a nice shortcut. And it's a nice way of undoing any confusion you might have caused for yourself. 
或者，如果你在文件夹中迷路或感到困惑，你实际上可以只输入 cd，什么也不输入，这样就可以把你带回到那个原始文件夹，无论你在哪里。所以这是一个很好的快捷键。这也是撤销你可能给自己造成的任何混淆的好方法。

Lastly, let's go ahead and get rid of the hello directory with rmdir hello, Enter. And that now disappears at top left, as well. Now, what I was hinting at here whereby I had my hello.c file in a folder and I was moving things around and renaming things and backing things up isn't strictly necessary because there's actually other features still inside of VS Code that you're welcome and encouraged to play around with. 
最后，让我们继续删除 hello 目录，使用 rmdir hello 命令，回车。现在，它也消失在左上角了。这里我暗示的，我有一个 hello.c 文件在文件夹里，我在移动文件、重命名文件和备份文件，其实并不是必需的，因为 VS Code 中还有其他功能供大家探索和尝试。

In fact, if I go to my so-called timeline at the bottom of my File Explorer here, you can actually see that there's been automatic backups made over time of this file. So if you click, click, click through those backups, you can actually see different versions of this same file slightly in the past, which might save you the trouble of having to manually create files. 
事实上，如果我去文件资源管理器的底部查看所谓的“时间轴”，你会发现这个文件已经自动备份了。所以如果你点击这些备份，你可以看到这个文件过去不同版本的细微变化，这可能会省去你手动创建文件的麻烦。

And in fact, in the world of software development and industry, there's actually standard tools, very similar in spirit to what we've been using GitHub for, that allow you manually to make different versions of your code so that you can proactively keep track of all the changes you've made without manually renaming things as you might typically on your own Mac or PC. All right, let me clear my terminal window and ask if there are any questions. Yes, over here. 
事实上，在软件开发和工业界，实际上有一些标准工具，其精神与我们一直在使用的 GitHub 非常相似，允许您手动创建代码的不同版本，以便您可以主动跟踪您所做的所有更改，而无需像在您自己的 Mac 或 PC 上那样手动重命名文件。好吧，让我清空我的终端窗口，看看有没有问题。是的，这里有一个。

AUDIENCE: What if you had a type other than [INAUDIBLE]? 
观众：如果你有一个不同于[听不清]的类型怎么办？

DAVID J. MALAN: Yeah, really good question. If we had something other than a string of text, if we had an integer, would you still use percent s? No, you would use something else. And, indeed, percent i is what we're going to use. And we're going to actually do that-- perfect segue-- to other types that C actually has. 
大卫·J·马尔兰：是的，这是一个很好的问题。如果我们不是处理一串文本，如果我们有一个整数，你还会使用百分号吗？不会，你会使用其他东西。实际上，我们会使用百分号 i。而且，我们将——完美的过渡——讨论 C 语言实际拥有的其他类型。

So up until now, we've been calling a string of text literally a string. And this is common in many programming languages, including Python and JavaScript. "Strings" in the programming world just mean text, whether it's zero or more characters thereof. 
到目前为止，我们一直把一串文本字面地称为字符串。这在许多编程语言中很常见，包括 Python 和 JavaScript。"字符串"在编程世界中只是指文本，无论它是零个还是多个字符。

But C does have other data types, just a few of which we'll dabble with today but you'll use more over time. We've already seen string, for instance, which is indeed a string of text. But let's focus, as well, on an integer. 
但 C 语言确实有其他数据类型，今天我们将简要探讨其中的一些，随着时间的推移，你会使用更多。例如，我们已经看到了字符串，它确实是一串文本。但让我们也关注一下整数。

As an aside, there's other types, too. There's Boolean values, like true or false. There's chars, which are single characters instead of full phrases or sentences. There's doubles and floats, which are real numbers, something with a decimal point, the equivalent of fractions. And there's longs, which are integers but longer integers, even bigger integers than you might type by default. 
顺便说一下，还有其他类型。有布尔值，如真或假。有字符，它们是单个字符，而不是完整的短语或句子。还有双精度浮点数和浮点数，它们是实数，带有小数点的数，相当于分数。还有长整型，它们是整数，但比默认类型的长，是更大的整数。

So let's focus on an int because so many computer programs of course manipulate numbers in some way. So what can we do with this? Well, if we want to be able to get an integer, lucky enough, CS50's library comes not just with get_string but also get_int. 
所以让我们关注一下整型，因为许多计算机程序当然会以某种方式处理数字。那么我们可以用它做什么呢？嗯，如果我们想获取一个整数，幸运的是，CS50 的库不仅提供了 get_string，还提供了 get_int。

So that's going to be a third function we now use in C. And we need to know what are generally called format codes. So that placeholder I called before, percent s, is indeed for a string. If we want to place an integer inside of something we're printing to the screen, we are, in fact, going to use percent i instead. 
所以这将是我们在 C 语言中使用的第三个函数。我们需要知道通常所说的格式代码。所以之前我提到的占位符，%s，确实代表字符串。如果我们想在屏幕上打印的内容中放置一个整数，实际上我们会使用%i。

So let's now actually use these building blocks, get_int and percent i to actually get numbers in some way to solve a problem. Well, what problem could we solve? Let's introduce another concept from scratch and programming more generally known as conditionals, like those proverbial forks in the road. If something is true, do this. Else, maybe do this other thing. 
现在让我们真正使用这些构建块，get_int 和 percent i 来以某种方式获取数字，以解决问题。那么，我们能解决什么问题呢？让我们从头开始介绍另一个概念，在编程中更广泛地被称为条件语句，就像那些传说中的道路分叉。如果某事是真的，就做这件事。否则，也许做另一件事。

So in Scratch, we might have had a set of puzzle pieces that looked like this. If x is less than y, then say, or have the cat say, x is less than y. So sort of stupid program. But it just demonstrates how we have two variables, x and y. In the context of Scratch, we're comparing them with a Boolean expression. We're using a conditional to then conditionally say or not say this phrase here, depending on whether this question has an answer of true or false, yes or no. 
在 Scratch 中，我们可能有一组看起来像这样的拼图块。如果 x 小于 y，那么就告诉，或者说让猫说，x 小于 y。所以，这是一个有点愚蠢的程序。但它只是展示了我们有两个变量，x 和 y。在 Scratch 的上下文中，我们用布尔表达式比较它们。我们使用条件语句来有条件地说或不说这里的话，根据这个问题是否有答案为真或假，是或否。

In C, it doesn't look all that different. It's a little more cryptic. But you say literally "if." You use parentheses, similar to functions. But confusingly, by convention, you put a space after the word "if." So you don't put spaces after function names. You do put spaces after words like "if." 
在 C 语言中，看起来并没有太大区别。它有点晦涩难懂。但你可以说“if”。你使用括号，类似于函数。但令人困惑的是，按照惯例，你在“if”这个词后面加空格。所以你不在函数名后面加空格。你在像“if”这样的词后面加空格。

And you use the parentheses to conjure up this weird trapezoidal-like shape. So there's no real keys that conjure that. So C uses parentheses, like most languages. 
你使用括号来召唤这种奇特的梯形形状。所以没有真正的键可以召唤出那个。C 语言就像大多数语言一样使用括号。

And then there's these weird curly braces, which, at least in English, we don't use all that often. But they're there on your keyboard, English or otherwise. And they essentially allow us to create this hugging shape to the puzzle piece. 
然后还有这些奇怪的括号，至少在英语中，我们并不经常使用。但它们在键盘上都有，无论是英语还是其他语言。它们本质上允许我们创建一个拥抱形状来适应拼图。

Anything inside of those curly braces is going to be equivalent to anything inside of this yellow hug that's sort of grabbing one or more pieces inside. So what do we put inside? Well, this part is straightforward-- printf, quote, unquote, "x is less than y" backslash n semicolon. 
任何在括号内的内容都将等同于黄色拥抱中抓取的一个或多个拼图部分。那么我们放什么在里面呢？这部分很简单-- printf，引号，"x 小于 y"，换行符；。

So nothing new here. The only bit of new code is this if construct instead. What if you have an if-else, so a two-way fork in the road? This is what that looked like in Scratch. Same question-- if x is less than y, then say x is less than y. Else, say x is not less than y. 
这里没有新内容。唯一的新代码是这个 if 结构。如果你有一个 if-else，即道路上的双向分支呢？这就是 Scratch 中它的样子。同样的问题--如果 x 小于 y，那么就说 x 小于 y。否则，就说 x 不小于 y。

In C, the code is going to be set up initially like this, so two sets of curly braces to represent this pair of yellow bars and this pair of yellow bars. And what's inside of them-- indented, no less, just like our pseudocode last week-- is two printfs-- x is less than y, x is not less than y. 
在 C 语言中，代码最初会设置成这样，所以一对花括号来表示这对黄色条，还有这对黄色条。它们里面的内容——缩进，没错，就像我们上周的伪代码一样——是两个 printf 语句——x 小于 y，x 不小于 y。

So that's it. So the only new stuff here really is now the else keyword, which does not need parentheses because you're just saying, else, do this other thing. But what if it's a three-way fork in the road? And we'll stop after that. 
就这样了。这里真正的新东西就是 else 关键字，它不需要括号，因为你只是说，else，做另一件事。但如果路分成了三岔口呢？我们就在这里停下来。

Here's a three-way fork in the road in Scratch. If x is less than y, then say this. Else, if x is greater than y, say this. Else, if x equals y, then say this. So this is a little more precise because now we're handling equality, not just greater than or the opposite. 
在 Scratch 中，这是一个三岔口。如果 x 小于 y，那么说这个。否则，如果 x 大于 y，说这个。否则，如果 x 等于 y，那么说这个。这样更精确，因为我们现在处理的是相等，而不仅仅是大于或小于。

In C, it's going to look similar to before. But we're adding this element here. And at first glance, especially if you've never programmed before, it looks like I'm an idiot and I made a typo. What looks wrong? There's two equal signs-- not a typo. 
在 C 语言中，它看起来和之前差不多。但我们在这里添加了这个元素。一开始看起来，尤其是如果你之前从未编程过，可能会觉得我是个白痴，犯了个错。看起来哪里不对？有两个等号——这不是错别字。

So it turns out, recall from earlier, when we use the equal sign the first time around, we used it in the context of getting a return value back from a function, like the get_string function handed me back the user's answer. So unfortunately, because humans decades ago decided, hey, let's use the equal sign to assign a return value from the right-hand side of a line of code to the left-hand side, we sort of painted ourselves into a corner and like, oh, shoot, what do we do when we actually want to test for equality of two values on the left and right? 
原来如此，回想一下之前，当我们第一次使用等号时，我们是在函数的上下文中使用它来获取返回值，比如 get_string 函数返回了用户的答案。所以不幸的是，因为几十年前人类决定，嘿，让我们用等号将一行代码右侧的返回值赋值给左侧，我们似乎把自己逼入了一个角落，哦，糟糕，当我们实际上想要测试左右两侧两个值的相等性时怎么办？

So what most languages, including C, do, is use double equal signs. So you say double equals or equals equals or whatever. But it is, in fact, syntactically correct. What's inside of these three sets of curly braces? Same idea-- printf, printf, printf based on what English phrase you want to print out. 
所以大多数语言，包括 C 语言，都是使用双等号。你说双等号或者等于等于，或者随便什么。但实际上，这是语法上正确的。这三组大括号里面是什么？同样的想法——printf，printf，printf，根据你想打印的英文短语。

So this code, both in Scratch and C, I'll claim is correct. It won't run because we still need the other stuff, the equivalent of the when green, flag clicked. But out of context, this code is correct. But there's a subtle weakness in design. And we'll talk a lot about this this week and beyond. 
所以，我声称这段代码在 Scratch 和 C 语言中都是正确的。它不会运行，因为我们还需要其他东西，也就是相当于“当绿旗被点击时”。但脱离上下文，这段代码是正确的。但是，设计上有一个细微的弱点。我们将在本周和未来讨论很多关于这个问题。

"Correctness" just means the code does what it's supposed to do. Design is more subjective. How well have you written your argument in an English paper, how well have you written your code, is design. This code is not designed as well as it could be because I'm doing more work than I need to. Yeah, in the back. 
"正确性"仅仅意味着代码做了它应该做的事情。设计则更加主观。你在英语论文中论证得有多好，你的代码写得有多好，这就是设计。这段代码的设计并不像它本可以做到的那样好，因为我做了我不需要做的额外工作。是的，在后面。

AUDIENCE: You don't need the [INAUDIBLE]. 
听众：你不需要[听不清]。

DAVID J. MALAN: Yeah, I don't need the x equals equals y. But why, logically? 
大卫·J·马兰：是的，我不需要 x 等于等于 y。但是为什么，从逻辑上讲？

AUDIENCE: Because [INAUDIBLE] [? there's no need. ?] [INAUDIBLE]. 
听众：因为[听不清] [?没有必要。?] [听不清]。

DAVID J. MALAN: Exactly, that's just a math thing. Either x is less than y, or it's greater than y. Or the third and final option is they must be equal. So it's subtle, but why would you bother wasting time writing a line of code and expecting the computer to run a line of code that is just going to answer a question that logically you could have concluded already? Because if x is not less than y and x is not greater than y, then, my god, just print out x is equal to y because you know, at that point, logically it's true. You don't need to waste your time or the computer's asking a third question unnecessarily. 
大卫·J·马兰：没错，这只是一个数学问题。要么 x 小于 y，要么大于 y。或者第三种也是最后一种情况，它们必须相等。所以这很微妙，但为什么要浪费时间写一行代码，并期望计算机运行一行代码来回答一个逻辑上你早已得出结论的问题呢？因为如果 x 既不小于 y，也不大于 y，那么，天哪，就打印出 x 等于 y 吧，因为你知道，在那个时刻，逻辑上这是真的。你不需要浪费时间或让计算机无谓地提出第三个问题。

In reality, it's not a huge deal. No one's going to notice in the real world on a Mac or PC that there's this extra line of code. But it's a bad habit. Keep it simple. Don't write code that doesn't need to be there if, logically, you can conclude otherwise. 
在现实中，这并不是什么大问题。在 Mac 或 PC 上，没有人会注意到这多出来的一行代码。但这是一个坏习惯。保持简单。如果逻辑上可以得出结论，就不要写不必要的代码。

So in fact, let's clean this up both in Scratch and in C. I can tighten this up, so to speak, use less code here, less code here. And honestly, if only statistically, the less code I write, the less likely I am going to make mistakes. So that, too, is probably a net positive overall. Writing less code is generally better than writing more code, not unlike English essays too, perhaps. All right, questions about this feature of C, conditionals and this syntax? Yeah? 
事实上，让我们在 Scratch 和 C 语言中都将它整理一下。我可以这样讲，减少这里的代码，减少这里的代码。说实话，即使从统计学的角度来看，我写的代码越少，我犯错误的可能性就越小。所以，这也可能是总体上的净正面效果。写更少的代码通常比写更多的代码要好，也许就像英语论文一样。好吧，关于这个 C 语言特性的问题，条件语句和这种语法？是的？

AUDIENCE: [INAUDIBLE]   观众：[听不清]

DAVID J. MALAN: Oh, a really good question. And, yes, jumping the gun. There are alternative ways to solve problems like these. And the question was, to summarize, when to use "if, else, if, else" versus what's called a switch statement. More on those another time. But this is going to be true, in general, in programming, not just C, not just in Scratch, but every language. 
大卫·J·马兰：哦，这是一个非常好的问题。是的，有些问题可以有多种解决方法。概括来说，问题是何时使用“if...else...if...else”与所谓的 switch 语句。关于这些内容，我们将在另一篇文章中详细介绍。但这一点在编程中通常是正确的，不仅限于 C 语言，也不限于 Scratch，而是适用于所有编程语言。

There are going to be several, dozens, hundreds, an infinite number of ways to solve problems. Among the things we're going to teach you, though, is indeed how to do things well or better than you might otherwise. And we're going to introduce you eventually to another feature of the language that can even simplify this code, too. 
解决问题的方法将会有很多，成百上千种，甚至是无限的。然而，我们将教授你们如何做得更好，或者比你们想象中做得更好。我们最终会介绍语言中的另一个特性，这个特性甚至可以简化代码。

So for now, let's actually use this then. So let me go over to VS Code again. I'm going to go ahead now and clear my terminal window down here. I'm going to go ahead and close the hello.c tab just so that it-- we're going to create a new program. And let's just do something a little simple using some operator, so to speak. 
所以现在，我们实际上就用这个吧。让我再次回到 VS Code。我现在要清空下面的终端窗口。我要关闭 hello.c 标签页，这样我们就可以创建一个新的程序。让我们用一些运算符来做点简单的事情。

And I haven't used this word by name. But it turns out that there's lots of operators that come with C, just like a lot of operators that came with Scratch, for doing assignment or less than or less than or equal to, greater than, greater than or equal to, actually equal to, not equal to. 
我还没有按名字使用这个单词。但 C 语言中有很多运算符，就像 Scratch 中有很多运算符一样，用于赋值或者小于、小于等于、大于、大于等于、实际上等于、不等于。

Now, some of these are a little cryptic. But there's no easily-found key on your US English keyboard, at least, where you can do less than or equals or greater than or equals. So what most programming languages do is you don't use a special symbol where there's an angled bracket and then a line below it. You actually just use two characters. 
其中一些可能有点难以理解。但在你的美式英语键盘上，至少没有容易找到的键可以用来输入小于等于或大于等于。所以大多数编程语言的做法是，你不需要使用一个带有一个尖角和一个下划线的特殊符号。你实际上只需要使用两个字符。

So greater than or equal is literally this, this. Less than or equal is literally this, this. We already saw that equals is this, this. And not equals is to use an exclamation point. So this, too, is a thing in programming. 
所以大于等于实际上是这个，这个。小于等于实际上是这个，这个。我们已经看到了等于这个，这个。不等于则是使用一个感叹号。所以，在编程中，这也是一个东西。

Using the exclamation point, pronounced bang, is how you invert, logically, certain things. So "bang equals" or "not equals" is how you would express exactly that idea. It's just a symbol on the keyboard that some human decided, let's use this one to invert the idea. 
使用感叹号，发音为“bang”，是逻辑上反转某些事物的表达方式。所以“bang 等于”或“不等于”就是用来表达这个想法的。这只是一个键盘上的符号，某个人类决定使用这个符号来反转想法。

But we're going to need one other thing for this program, specifically variables, which we've used already because, in Scratch, we got one for free. We had that answer variable that stored the return value of the ask block. But let's consider, in general, how you can-- and probably did for problem set 0-- use a variable of your own, like keeping track of a counter or a score or the like. 
但我们还需要这个程序的一个其他东西，具体来说是变量，我们已经使用过了，因为在 Scratch 中我们免费得到了一个。我们有一个存储 ask 块返回值的 answer 变量。但让我们一般地考虑一下，你如何——可能你在问题集 0 中也这样做了——使用自己的变量，比如跟踪计数器或分数等。

In Scratch, if you want to create a variable called counter, you can set it equal to some initial value, like 0. In C, that code is going to look similar. You literally just write whatever name you want to give the variable, then an equal sign, and then the value you want to give that variable. And because the equal sign is the assignment operator, it will behave essentially right to left and copy the 0 into counter. 
在 Scratch 中，如果你想创建一个名为 counter 的变量，你可以将其设置为某个初始值，比如 0。在 C 语言中，代码看起来会相似。你实际上只需要写你想要的变量名，然后是一个等号，然后是你想赋予变量的值。因为等号是赋值运算符，所以它将从右向左复制 0 到 counter 变量中。

But this isn't enough for C. Remember that you, the programmer, have to tell the computer, is this indeed a number? Is it a letter? Is it an image? Is it a sound? You have to tell the computer that this is an integer, otherwise written as "int" for short in C. 
但是这对 C 来说还不够。记住，程序员必须告诉计算机，这究竟是一个数字吗？这是一个字母吗？这是一张图片吗？这是一段声音吗？你必须告诉计算机，这是一个整数，在 C 语言中简写为“int”。

But there's one other stupid detail that's missing, which is now-- semicolon to finish the thought here. But this then is equivalent to this in Scratch. Let's do another. In Scratch, if you wanted to increment the counter, that is add 1 to it, you could literally use this puzzle piece here and specify you want to add 1. In C, it's going to look like this-- counter equals counter plus 1 semicolon. 
但是还有一个愚蠢的细节缺失，那就是现在——在这里用分号结束这个想法。但是这和 Scratch 中的这个操作是等价的。让我们再做一个。在 Scratch 中，如果你想增加计数器的值，也就是给它加 1，你可以直接使用这个拼图块，并指定要加 1。在 C 语言中，它将看起来像这样——计数器等于计数器加 1 分号。

Now, at a glance, this seems like a paradox of sorts. How can counter equal counter plus 1? I can't make that math expression true. But it's not math in this case. The single equal sign is assignment. So this means take the current value of counter, whatever it is, add 1 to it, and then copy that value from right to left into the same variable, thereby changing it from 1 to 2, 2 to 3, and so forth. 
现在看起来这似乎是一种悖论。计数器怎么可能等于计数器加 1？我无法使这个数学表达式成立。但这里不是数学。单个等号是赋值操作。这意味着取计数器的当前值，无论它是什么，加 1 到它，然后将这个值从右到左复制到同一个变量中，从而将其从 1 变为 2，2 变为 3，以此类推。

This, though, is so common in programming, to be able to increment or even decrement numbers by one or two or more, is that you can tighten it like this. This is the exact same thing-- a little faster to type, saves you keystrokes, maybe less chance for error. Counter plus equals 1 semicolon is the exact same idea. 
虽然，在编程中，能够通过一或二或更多来增加或减少数字是很常见的，但你可以这样来简化它。这和下面的是完全一样的——打字更快，节省按键，可能出错的机会更少。计数器加等于 1 分号就是同样的概念。

Better still, this is so common in C and C++ and Java that there's a third way to do this, to my comment earlier about solving problems in different ways. The most canonical, the most popular way is probably just to say counter++ semicolon, which literally, automatically, adds 1 to that value. 
更好的是，这在 C、C++和 Java 中非常常见，因此有第三种方法来做这件事，就像我之前说的，用不同的方式解决问题。最经典、最受欢迎的方法可能是简单地写 counter++分号，这实际上会自动将那个值加 1。

It only works for 1. If you want to do 2 or 3 or some other increment, you have to use one of the other approaches. But this simply does the same thing as this. And if you want to invert it to negative 1, you change the plus plus to a minus minus instead. 
这只适用于 1。如果你想增加 2、3 或其他数字，你必须使用其他方法之一。但这个方法实际上和上面的是一样的。如果你想将其变为-1，只需将加加号改为减减号即可。

So again, just little things that we'll see and pick up over time. Invariably, you'll have to look them up or check the notes or look back at the lecture slides. But in time, this will get familiar if you are not already familiar. 
所以，这只是我们随着时间的推移会看到和学会的小事情。不可避免地，你将不得不查找它们或查看笔记或回顾讲座幻灯片。但如果你还不熟悉，随着时间的推移，这会变得熟悉起来。

So let's consider just logically how we might implement this in code. Let's go back to VS Code here. And let me propose that we create a program called compare.c whose purpose in life is just to compare a couple of values. 
让我们从逻辑上考虑如何在代码中实现这一点。让我们回到 VS Code。让我提出创建一个名为 compare.c 的程序，其目的仅在于比较几个值。

I'm going to go ahead and proactively, based on the previous chat, include CS50's library from the get go. I'm going to include standard io.h from the get go. So I can use get_int and printf respectively. 
根据之前的聊天，我将从一开始就主动包含 CS50 库。我将从一开始就包含标准 io.h。这样我就可以使用 get_int 和 printf 了。

I'm going to just, on faith, type int main(void). And today, we won't explain what that does. More on that to come. For now, just assume it's like, when green, flag clicked. 
我将仅基于信仰，输入 int main(void)。今天，我们不会解释它做什么。更多内容将在后续介绍。现在，只需假设它就像当绿色旗帜被点击时。

But in this program, let's do a couple of things. Let's declare an integer called x and assign it the return value of get_int. And let's just keep it simple. Let's ask the user not what's their name, but "What's x?," question mark, semicolon. 
但是在这个程序中，让我们做几件事情。让我们声明一个名为 x 的整数，并将其赋值为 get_int 的返回值。让我们保持简单。让我们询问用户不是他们的名字，而是“x 是什么？”，问号，分号。

Now, so that we have something to compare, let's do it again but with y. int y equals get_int, quote, unquote, "What's y?", question mark. And I'm leaving again a space just visually so the cursor nudges over a bit, followed by a semicolon. 
现在，为了进行比较，我们再试一次，但是用 y。int y 等于 get_int，引号，不引号，“y 是什么？”，问号。我在这里又留了一个空格，以便从视觉上使光标稍微移动一点，然后是分号。

At this point in the story, my users will be prompted for x and y respectively. Let's do something with those values. How about if x is less than y, then go ahead and print out, quote, unquote, "x is less than y" backslash n, close quote, semicolon. 
在故事的这个阶段，我的用户将被提示输入 x 和 y。让我们用这些值做点什么。如果 x 小于 y，那么就打印出，引号，不引号，“x 小于 y”，换行符，关闭引号，分号。

All right, and let me hide my terminal window for just a moment. This is a 13-line program at the moment. But really, it's five or six interesting lines. The rest has been copy/paste from previous programs. 
好吧，让我暂时隐藏一下我的终端窗口。目前这是一个 13 行的程序。但实际上，只有五到六行是有趣的。其余的都是从之前的程序复制粘贴过来的。

Notice a few details. One, I've indeed used my curly braces here. And notice, if you highlight lines, you'll actually see little dots that can help you make sure, oh, there are indeed four spaces there. 
注意一些细节。首先，我确实在这里使用了花括号。注意，如果你高亮显示行，你实际上会看到可以帮助你确认的点点，哦，这里确实有四个空格。

I've been indenting just like we did last week with pseudocode. Strictly speaking, it's not necessary. But it's going to be way easier to read your code if you do at all of this whitespace, so to speak, than if you write and then submit to us, as homework, a program that looks sort of godawful like this, which is going to make it much, much harder for the human to read it, for you to read it, your colleagues in the real world to read it. But the computer is actually not going to care. 
我一直像上周我们用伪代码做的那样缩进。严格来说，这并不是必要的。但如果你这样做所有的空白，从某种意义上说，那么阅读你的代码将会容易得多，而不是如果你写完然后提交给我们作为作业，一个看起来有点糟糕的程序，这将使人类、你、现实世界中的同事阅读它变得困难得多。但计算机实际上并不在乎。

In fact, as an aside, one of the tools we have built into VS Code for CS50 is this button at top called style50. This is a program that we indeed wrote that will give you suggestions on how to improve the style of your code so it looks like the right way that programmers would generally write it. 
顺便说一句，我们为 CS50 在 VS Code 中构建的一个工具是这个顶部按钮叫做 style50。这是一个我们确实编写的程序，它将给你建议，如何改进你的代码风格，使其看起来像程序员通常编写的方式。

As an aside, the computer world is fraught with religious debate, so to speak, as to what code should look like. And people in the real world will have really stupid arguments over how many spaces to use for indentation and what lines code should go on and so forth. Generally, in the real world or in a class, there's an official style guide that someone autocratically declares this is how everyone should write their code so that just everyone's code in the company or course looks the same. But you'll find, in the real world, reasonable people will disagree. 
作为旁白，从某种意义上说，计算机世界充满了宗教般的辩论，关于代码应该是什么样子。在现实世界中，人们会在如何使用空格进行缩进以及代码应该放在哪一行等问题上展开真正愚蠢的争论。通常，在现实世界或课堂上，会有一个官方的风格指南，有人专制地宣布这就是大家应该编写代码的方式，以便公司的每个人或课程的每个人的代码看起来都一样。但你会发现，在现实世界中，理性的人会持不同意见。

When you click style50, it will be formatted as we ourselves recommend in CS50. And in fact, let me zoom out here. And this looks a little cryptic at first glance. But on the left is the code that I just wrote and made a mess of by deleting all that whitespace. On the right is the way the code should look if it is well styled. 
当你点击 style50 时，它将以我们自己在 CS50 中推荐的方式格式化。事实上，让我放大一下。乍一看，这有点令人费解。但左边是我刚刚写的，通过删除所有空白而变得混乱的代码。右边是代码经过良好格式化后应该看起来样子。

So whereas correctness is all about, does the code work the way it's supposed to, design is about, how well have you written that code? Is it efficient? Did you make good decisions? Style is purely aesthetic. Is it readable? Does it follow a standard? Can another human easily skim it top to bottom, left to right, and understand what's going on? 
所以，正确性是关于代码是否按预期工作，设计是关于你编写代码的质量如何？它是否高效？你是否做出了好的决策？风格完全是审美性的。它是否易于阅读？它是否遵循标准？其他人是否可以轻松地从头到尾、从左到右浏览它并理解正在发生的事情？

So these green highlights are saying, please add white space there. And so I can actually change my code to match. On the left-hand side here, if I realize, oh, my code is looking pretty ugly, watch on line 6 at left. 
所以这些绿色高亮表示，请在那里添加空格。这样我就可以实际修改我的代码以匹配。在左侧这里，如果我意识到，哦，我的代码看起来很丑陋，看看左边的第 6 行。

As I hit the space bar two-- oops, sorry-- on the left, 1, 2, 3, 4, notice that the right-hand side is starting to be happier with my code by getting rid of the green indicators. And I can do 1, 2, 3, 4. That fixed that. Over here, I can do 1, 2, 3, 4. I can move this onto its own line by hitting Enter. 
当我按下空格键两次——哎呀，对不起——在左侧，1，2，3，4，注意右侧开始对我的代码感到满意，通过消除绿色指示器。我可以做 1，2，3，4。这样就解决了。在这里，我可以做 1，2，3，4。我可以通过按 Enter 将其移动到自己的行上。

And you know what, if it's taking too long, once you get into the habit of things, you can just Apply Changes. It will give you the suggestions automatically. And we're done and on our way. But for practice's sake, I would get into the habit of doing things manually until it gets boring and tedious, at which point, you might as well automate the process with a single click. 
你知道吗，如果它花费的时间太长，一旦你养成了习惯，你就可以直接应用更改。它会自动给你建议。我们就完成了，正在路上。但为了练习，我会养成手动做事的习惯，直到它变得无聊和乏味，那时你就可以通过单击一键自动化这个过程。

All right, so let's actually run this code. I'm going to go ahead and open my terminal window again and clear it for clarity. I'm going to run make compare and hope that I didn't make any mistakes. I don't seem to have yet-- "./compare." 
好吧，让我们实际运行这段代码。我将再次打开我的终端窗口并清除它以保持清晰。我将运行 make compare 并希望我没有犯任何错误。看起来我还没有——“./compare。”

And now notice I'm prompted for x. Let's type 1. For y, let's type 2. Enter. And x is less than y. Let's do a little sanity check, so to speak. Let's rerun it-- c 
现在注意我被提示输入 x。让我们输入 1。对于 y，让我们输入 2。回车。x 小于 y。让我们做一个简单的合理性检查，换句话说。让我们重新运行它--

What's x? Let's do 2 this time; 1 for y. And this time, it said nothing. So that's to be expected because I didn't have a two-way or a three-way fork in the road. The only time this code should say anything is if, indeed, x is less than y. 
x 是什么？这次我们做 2 次；1 次为 y。这次什么也没说。这是预期的，因为我没有双向或三向分叉。只有当 x 确实小于 y 时，这段代码才应该说些什么。

So for those of you who might be more visual when it comes to learning, here's a flow chart that represents this same exact program. If you read it top to bottom, you start the program with "./compare." You are then prompted for x and y. And you're asked this, is x less than y? 
因此，对于那些在学习时可能更倾向于视觉的人来说，这里有一个流程图，它代表了完全相同的程序。如果你从上到下阅读它，你将使用“./compare”开始程序。然后你会被提示输入 x 和 y。然后你会被问到，x 是否小于 y？

And the fact that this is a diamond means this is a Boolean expression, a question that the computer is asking itself. If the answer to that question is true, then, quote, unquote, "x is less than y" gets printed. And the program stops. Else, if x is not less than y, as in the second scenario, the answer is, of course, false, and nothing more happens. 
事实上，这是一个菱形，这意味着这是一个布尔表达式，是计算机在问自己的问题。如果这个问题的答案是 true，那么，引用一下，“x 小于 y”就会被打印出来。然后程序停止。否则，如果 x 不小于 y，就像第二个场景一样，答案是当然的 false，就没有其他的事情发生。

But we can build out this tree, so to speak, by adding a bit more code. So let's make it look like the second Scratch example. If I go back here, it's not hard to just say, else, if x is not less than y, let's say that. "x is not less than y" backslash n, close quote, semicolon. 
但我们可以通过添加一点更多的代码来扩展这个树，换句话说。所以让我们让它看起来像第二个 Scratch 示例。如果我回到这里，说“else”，如果 x 不小于 y，这并不难。比如说“x 不小于 y”回车，关闭引号，分号。

Let me now go ahead and rerun make compare. Enter. "./compare," Enter. And again, I'll do the second example-- 2, which is bigger, and 1, which is smaller. And this time, I will see x is not less than y. 
现在我将重新运行 make compare。输入。输入“./compare”，输入。然后，我会做第二个例子--2，较大的数，和 1，较小的数。这一次，我会看到 x 不小于 y。

If, then, we were to look not at this flow chart but a slightly bigger one, you can visualize it this way. Everything in the left-hand side of this picture is the same. But if it's not true that x is less than y, the answer is thus false. This time we say, quote, unquote, "x is not less than y." 
如果我们不是看这个流程图，而是看一个稍微大一点的图，可以这样想象。这张图的左侧内容都是一样的。但如果 x 不小于 y 这个条件不成立，那么答案就是错误的。这次我们说，引用一下，“x 不小于 y。”

And we can do this obviously one final time just to bring the point home. If I go back to my code and I even more pedantically compare these three values, let me go ahead and do this. So, else-- hm, I don't want an else actually. 
很明显，我们可以再次这样做，只是为了强调这个观点。如果我回到我的代码中，甚至更严格地比较这三个值，让我来做这个。所以，else——嗯，我实际上不想用 else。

So let's go ahead and do this-- else if x is greater than y, let's then say "x is greater than y" in English. And then, finally, have an else that says printf "x is equal to y," close quote, or rather backslash n, close quote, semicolon. 
所以我们继续做这个——如果 x 大于 y，那么我们就在英语中说“x 大于 y”。然后，最后有一个 else，输出“x 等于 y”，引号，或者更确切地说，反斜杠 n，引号，分号。

So just to show this all on the screen at once, this is identical Now to that Scratch version. It's well designed because I'm not asking the equals equals question unnecessarily. If I go back to my terminal window here, clear the screen, run make compare, Enter, and then "./compare" again. Enter. "What's x?" Let's do 1. Let's do 2. "x is less than y." 
为了一次性在屏幕上展示这个，这与 Scratch 版本完全相同。它设计得很好，因为我没有不必要地提出等于等于的问题。如果我回到这里的终端窗口，清屏，运行 make compare，按 Enter，然后再次运行"./compare"。按 Enter。“x 是什么？”让我们做 1。让我们做 2。“x 小于 y。”

Let's run it again-- "./compare." "What's"-- 2 and 1. "x is greater than y." One more time-- "./compare." "What's x?" 1. "What's y?" 1. And now x is equal to y. 
让我们再试一次-- "./compare." "What's"-- 2 和 1. "x 大于 y。" 再来一次-- "./compare." "What's x?" 1. "What's y?" 1. 现在 x 等于 y。

As an aside, if I seem to be typing fairly fast, you can actually cheat with your keyboard. If you go up or down, you can scroll through all of the past commands that you've typed. So it's actually very useful. 
顺便说一句，如果我看起来打字很快，你可以用键盘作弊。如果你向上或向下移动，你可以浏览你之前输入的所有命令。所以实际上非常实用。

If you just hit up, it will pre-write the previous command for you, at which point you can just say Enter. Or there's other fancy features built into this programming environment. If you do dot slash C-O-M and then get bored with typing out the whole English word, you can hit Tab for tab completion like in a web browser. And it, too, will autocomplete if it finds a file that starts with those letters. So little efficiencies here. Questions then on the code here? Yeah? 
如果你只是按上箭头，它会预先写入之前的命令，然后你可以直接按 Enter。或者这个编程环境内置了其他一些高级功能。如果你输入点斜杠 C-O-M，如果你对输入整个英文单词感到厌烦，你可以按 Tab 键进行自动补全，就像在网页浏览器中一样。如果它找到了以这些字母开头的文件，它也会自动补全。所以这里有一些小效率。关于这段代码有什么问题吗？是的？

AUDIENCE: I have a question about libraries. 
观众：我对库有一些问题。

DAVID J. MALAN: Sure. 
大卫·J·马兰：当然。

AUDIENCE: [INAUDIBLE] is there any downside to putting in all the libraries? 
观众：[声音模糊]把所有库都放进去有什么缺点吗？

DAVID J. MALAN: A good question. Is there any downside to just putting in all of the libraries like we saw in the manual pages a moment ago? Performance. So generally speaking, C is meant to be a very efficient language, so much so that, even though it's decades old, still used omnipresently nowadays because it's so fast. It therefore minimizes time. It minimizes energy use. 
大卫·J·马兰：这是一个好问题。像我们在刚才的手册页面上看到的那样，把所有库都放进去有什么缺点？性能。一般来说，C 语言是一种非常高效的编程语言，因此尽管它已经几十年历史了，但至今仍然无处不在，因为它运行得非常快。因此，它最小化了时间。它最小化了能源消耗。

So it's still being used heavily. You would slow things down if you told the compiler, by the way, give me all of these other functions that I'm never going to use. So in short, just don't do that because it's unnecessary. But a good question. Other questions on what we've done here? Yeah, in front. 
因此，它仍然被广泛使用。如果你告诉编译器，顺便说一句，给我所有这些我永远不会使用的其他函数，那么你将会减慢速度。所以简而言之，不要这样做，因为这是不必要的。但这是一个好问题。还有关于我们刚才所做内容的问题吗？是的，前面那位。

AUDIENCE: [? Just to follow up, ?] [? why is it C? ?] 
观众：[？只是想跟进一下，？] [？为什么是 C？？]

DAVID J. MALAN: What is it-- oh, why is C faster? Why is C faster than other languages, let me answer that in more detail in week 6, when you'll see how much easier it is to write code in other languages because someone else is doing a lot of the work for you. So as an introductory course, we're teaching you bottom up, like how do you write code? How does the computer understand code? 
大卫·J·马尔安：这是什么——哦，为什么 C 更快？为什么 C 比其他语言更快，让我在第六周更详细地回答这个问题，那时你们会看到在写代码时，其他语言有多容易，因为别人已经为你做了很多工作。所以作为入门课程，我们是从基础开始教的，比如你如何编写代码？计算机是如何理解代码的？

Eventually, this kind of stuff, certainly after five, six weeks of this, it's going to get tedious doing some of these things. We're going to switch to another language that takes away the tedium and allows us to really focus on the problems to be solved once we've graduated to that point. Yeah? 
最终，这种东西，肯定在五、六周之后，做一些这些事情会变得乏味。我们将切换到另一种语言，这种语言可以消除乏味，并允许我们真正专注于毕业后要解决的问题。好吗？

AUDIENCE: [INAUDIBLE] shortcuts? 
观众：[听不清]快捷键？

DAVID J. MALAN: Sure. To repeat the keyboard shortcuts, you can just go up, up, up, up, up. And that will go through all of your previous commands, at which point you can just hit Enter. Or you can use Tab completion. 
当然。要重复键盘快捷键，你可以一直向上，向上，向上，向上，向上。这样就会遍历你之前的所有命令，此时你可以直接按 Enter 键。或者你可以使用 Tab 键自动完成。

So you can start typing a word like "code." And C-O-D tab will finish the thought. Or dot slash C-O-M Tab will finish that thought just to save yourself some keystrokes. And clearing the screen is Control L, which has no functional purpose other than keeping things neat and tidy in class. 
因此您可以开始输入一个单词，比如“代码”。按下 C-O-D 制表符将完成这个想法。或者按下点斜杠 C-O-M 制表符来完成这个想法，以节省一些按键。清除屏幕是 Ctrl+L，它除了保持课堂整洁外，没有其他功能。

So a design question. So this code, I dare say, is correct. Let me zoom in a little bit here. Let me change the code to just do this, even though we already saw from Scratch that we probably shouldn't do this. 
那么，这是一个设计问题。我敢说，这段代码是正确的。让我稍微放大一点。让我修改代码只做这个，尽管我们已经从 Scratch 中看到我们可能不应该这样做。

Why should we not do this if, especially, I'm just more comfortable asking three separate questions, like if x is less than y, if x is greater than y, if x equals y, do this? It's a nice world to live in. Just ask your questions. You don't have to worry about else, else-if, else-if, forks in the road. You can just ask three questions. But let's put a finger on, why is this correct, yes, but not well designed? Yeah, in back again? 
为什么我们不应该这样做，尤其是，我更习惯于提出三个单独的问题，比如如果 x 小于 y，如果 x 大于 y，如果 x 等于 y，就做这个？这是一个美好的世界。只需提出问题。你不必担心 else，else-if，else-if，道路的分叉。你只需提出三个问题。但让我们指出来，为什么这是正确的，是的，但不是设计良好的？又回来了吗？

AUDIENCE: [INAUDIBLE]   观众：[听不清]

DAVID J. MALAN: OK, there could be cases that are potentially outside of these three. Because this is relatively simple math, comparing numbers, we don't have to worry about that here. But, yes, in general, you might miss a scenario without using a catchall like else. 
大卫·J·马兰：好吧，可能会有一些情况超出了这三种。因为这是相对简单的数学，比较数字，我们在这里不必担心这一点。但是，是的，在一般情况下，如果你不使用像 else 这样的通配符，可能会错过一个场景。

AUDIENCE: Maybe more than one of them would be evaluated as true. 
观众：可能其中之一会被评估为真。

DAVID J. MALAN: Yeah, so maybe more than one of them could be evaluated as true-- not going to happen here. But, yes, you could accidentally create a situation where two things print or three things print because you didn't really think about the boundaries among these questions that you're asking. Again, not applicable here but, in general, a good concern. 
大卫·J·马兰：是的，所以可能其中之一会被评估为真——在这里不会发生。但是，是的，你可能会不小心创建一个情况，其中两个或三个东西都会打印出来，因为你没有真正考虑你提出的问题之间的边界。再次强调，这里不适用，但总的来说，这是一个很好的关注点。

AUDIENCE: You're forcing the computer to have a condition that doesn't need to be checked if I slow it down. 
观众：如果你放慢速度，你是在强迫计算机检查一个不需要检查的条件。

DAVID J. MALAN: Really good. Really, what's concerning here in this example is you're slowing the computer down by wasting its time, having it do work that is logically unnecessary, even more so than the Scratch in the first C example. Why? 
DAVID J. MALAN: 真的好。真的，在这个例子中令人担忧的是，你通过浪费计算机时间，让它做逻辑上不必要的工
    作，甚至比第一个 C 例子中的 Scratch 还要糟糕。为什么？

Suppose that I type in 1 for x and 1 for y. Because I wrote this code top to bottom, this question is going to be asked no matter what. The answer is going to be false. This question is going to be asked no matter what. The answer is going to be false. This question is going to be asked. And no matter what, the answer is going to be true. 
假设我输入 1 作为 x，1 作为 y。因为我从上到下编写了这段代码，这个问题无论如何都会被问到。答案将
    是错误的。这个问题无论如何都会被问到。答案将是不正确的。这个问题会被问到。而且无论如何，答案将
    是正确的。

We're OK there because we had to ask all three questions. But suppose I did the first thing, x is 1, y is 2. Then this first question is going to be true because x is less than y. 1 is less than 2. So this is going to print. 
我们在那里没问题，因为我们必须问所有三个问题。但是，假设我做了第一件事，x 是 1，y 是 2。那么这
    个第一个问题将是正确的，因为 x 小于 y。1 小于 2。所以这将打印出来。

And yet, then I'm wasting everyone's time asking, hm, is x greater than y, even though it obviously isn't. Is x equal to y? Hm, it obviously isn't. You're doing three times as much work in that particular case. It's just not good design. 
然而，然后我浪费时间问，嗯，x 是否大于 y，尽管这显然不是。x 是否等于 y？嗯，这显然不是。你在那
    个特定情况下做了三倍的工作。这根本不是好的设计。

And again, for those of you who think a little more visually, we can actually make this picture to match. Here is a final flowchart for bad code, bad design. Why? Because no matter what, when you start the program and you want to stop the program, you're going through all three of those darn questions no matter what, whereas the previous flowcharts got us to the Stop bubble faster by taking alternative arrows based on true or false answers. 
再次提醒，对于那些喜欢视觉化的人来说，我们实际上可以让这张图片与之匹配。这是关于糟糕代码和糟糕设计的最终流程图。为什么？因为无论什么情况，当你开始程序并想要停止程序时，你都必须经过那三个讨厌的问题，而之前的流程图通过基于真或假的答案选择不同的箭头来更快地到达停止气泡。

So in short, still correct but bad design. And so again, even for problem set 1, when we start writing C code, consider not just getting the job done but how you might get the job done better than you might otherwise. 
简而言之，虽然正确，但设计不佳。因此，即使是对于问题集 1，当我们开始编写 C 代码时，不仅要考虑完成任务，还要考虑如何做得比原本更好。

All right, let's add a few other features into the mix. Here we have those same data types that are supported by C. Let's focus for a moment on something a little simpler, just chars, single characters. Unfortunately, for better or for worse, in C, the language makes a distinction between strings of text, which are generally words, phrases. They can, confusingly, be single characters or even zero characters if you don't type anything in between the quotes. But more on that another time. 
好吧，让我们在混合中添加一些其他功能。这里我们有 C 语言支持的相同数据类型。让我们暂时关注一些更简单的东西，比如单个字符。不幸的是，不管好坏，在 C 语言中，该语言在文本字符串和单词、短语之间做出了区分。它们可以令人困惑地是单个字符，甚至是零个字符，如果你在引号之间不输入任何内容。但关于这一点，我们下次再说。

But when you know from the get go that you only want to get a single character back from the user, like "y" for yes, "n" for no, for instance, which is super common in programs, you can get that using a char and CS50's own function, get_char. So how might we use this? 
但是当你一开始就知道你只想从用户那里获取一个字符，比如“y”代表是，“n”代表否，这在程序中非常常见时，你可以使用 char 和 CS50 的 get_char 函数来实现。那么我们该如何使用它呢？

Well, let's go back to VS Code here. I'm going to close compare.c. And let's write a third program altogether. Let's call this one agree.c. And this is meant to represent like terms and conditions, where you have to check a box yes or no or something like that. 
好吧，让我们回到 VS Code。我将关闭 compare.c 文件。现在让我们写第三个程序。让我们称这个程序为 agree.c。这个程序用来表示类似条款和条件的情况，你必须勾选一个复选框表示是或否。

In this program, I'm going to go ahead and do the following. I'm going to go ahead and, as before, include cs50.h, so we've got it, include standard io.h so that we've got it, int main(void) because we have to do that for now. More on that another time. And now let's ask the user a question. Do they agree? 
在这个程序中，我将做以下操作。我将像之前一样包含 cs50.h，这样我们就有了它，包含 standard io.h，这样我们也就有它了，int main(void)因为现在我们必须这样做。关于这个话题的更多内容，我们下次再讨论。现在让我们询问用户一个问题。他们同意吗？

So I'm going to call get_char and then pass in a prompt of, "Do you agree?", question mark, with a space, semicolon. But as before with get_string and get_int, those functions return a value. So I want to assign that value from right to left to a variable, which I could call "answer again." But honestly, this program is so short, we're just going to use the letter c, which is conventional. So "c" for char, "i" for int, or "n" for number are very common. 
因此，我将调用 get_char，然后传入一个提示“你同意吗？”，后面跟一个问号，一个空格，分号。但就像之前使用 get_string 和 get_int 一样，这些函数会返回一个值。所以我想要从右到左将这个值赋给一个变量，这个变量我可以叫它“answer again”。但说实话，这个程序太短了，我们直接用字母 c，这是惯例。所以“c”代表字符，“i”代表整数，或者“n”代表数字，这些都是非常常见的。

But one more thing. What's still missing for my variable here? The type. I need to say, this shall be a char, not an int, not a string, a single char. 
但这里我的变量还缺少什么？类型。我需要说明，这是一个 char 类型，不是 int，也不是 string，是一个单个字符。

All right, now what do I want to do? I can ask a question. If c equals equals lowercase y, then go ahead and print out, just so we see something on the screen, "Agreed" period, backslash n, as though they agreed to the terms and conditions. Else, if c equals equals lowercase n, go ahead and print out, for instance, "Not agreed" just so we see something on the screen. 
好吧，现在我想要做什么？我可以提问。如果 c 等于等于小写的 y，那么就打印出“Agreed.”，就像我们在屏幕上看到的那样，表示他们同意了条款和条件。否则，如果 c 等于等于小写的 n，就打印出“Not agreed”，就像我们在屏幕上看到的那样。

So let me hide my terminal window and focus on the code. There's a couple of details here that are a little interesting. So, one, what did I do on line 7 and 11 that is not consistent with what I've done before? Subtle. So I'm using apostrophes or single quotes now instead of double quotes. Why? It's a C thing. 
让我隐藏我的终端窗口，专注于代码。这里有几个细节有点有趣。首先，我在第 7 行和第 11 行做了什么，这与我之前的行为不一致？微妙。所以我现在使用撇号或单引号而不是双引号。为什么？这是一个 C 语言的问题。

When you're using strings, you use double quotes. When you use single chars, you use single quotes. So the argument to get char, that's still a string. It's a whole sentence that I'm passing in. So that is just like get_int, just like get_string. But when I get the answer back, the return value, and put it in this variable and I want to check, what is that one char, I have to surround the char I'm comparing against in single quotes or apostrophes, both for the y and for the n. 
当你使用字符串时，你使用双引号。当你使用单个字符时，你使用单引号。所以获取字符的参数仍然是一个字符串。这是一个我传递的整个句子。所以这就像 get_int，就像 get_string。但是当我得到答案，返回值，把它放在这个变量里，我想检查，那个一个字符，我必须用单引号或撇号包围我要比较的字符，对于 y 和 n 都一样。

So this program is not super well designed because it's not going to handle uppercase. It's not going to handle weird inputs very well. But let me open my terminal window. 
这个程序设计得并不太好，因为它无法处理大写字母。它也无法很好地处理奇怪的输入。但是让我打开我的终端窗口。

Make agree, Enter. The code compiles OK-- "./agree." Do I agree? Let's try it. y for yes. OK, let's try it again-- "./agree." n for no. "Not agreed." 
同意，按 Enter。代码编译正常-- "./agree." 我同意吗？让我们试试。按 y 表示是。好的，我们再试一次-- "./agree。" 按 n 表示否。不同意。

Let's do it one more time. Let's very enthusiastically say "YES" in all caps, and it just kind of ignores me. But why? Well, this is a feature of CS50's get_char function. If you tell us you want to get a char, we're not going to tolerate a whole string of text from the user. We're going to prompt them again and again and again until they give us just one char. 
让我们再来一次。让我们非常热情地说“YES”，全部大写，但它好像忽略了我。但是为什么？这是因为 CS50 的 get_char 函数的一个特性。如果你告诉我们你想获取一个字符，我们不会容忍用户输入一整串文本。我们会不断地提示他们，直到他们只给我们一个字符。

So "YES," is three times too long. So let's actually just do a single capital Y and see what happens. Return. The program ignores me altogether. So all right, this is kind of a poorly designed program. It's a little annoying that we'll just ignore humans even if they type in Y or N that just happens to be uppercase. 
所以“YES”太长了，有三次之多。所以我们实际上只输入一个单独的大写 Y，看看会发生什么。按回车。程序完全忽略了我。所以，这个程序设计得有点糟糕。有点讨厌的是，即使我们输入的是大写字母 Y 或 N，程序也会忽略人类。

So let's improve this. Let me go ahead and add a couple more conditions. Else if c equals equals uppercase Y, then go ahead and print out "Agreed," same as before. And then, down here, else if C equals equals capital N, then let's go ahead and print out, again, "Not agreed." 
那么，让我们改进一下。让我先添加几个条件。如果 c 等于大写 Y，那么就打印出“同意”，和之前一样。然后，在这里，如果 C 等于大写 N，那么我们再打印出，“不同意”。

So this is now more correct. It's still going to ignore bogus input that makes no sense, if it's just the word-- if it's a different letter altogether. But this, too, code, while correct in some sense, is still poorly designed. Even if you've never programmed before, what rubs you the wrong way about this code now? Be critical. Yeah? 
现在这是正确的。它仍然会忽略没有意义的虚假输入，如果它只是单词——如果它是完全不同的字母。但是，这个代码，虽然在某些意义上是正确的，但仍然设计得很糟糕。即使你没有编程经验，现在让你感到不舒服的是什么？要批判。是吗？

AUDIENCE: [INAUDIBLE] uppercase and lowercase Y's together [INAUDIBLE]. 
观众：[听不清] 大写和小写 Y 一起[听不清]。

DAVID J. MALAN: Yeah, it'd be nice to just merge the lowercase and the uppercase Y together, the same thing for the lowercase and the uppercase N. Why? If only because literally lines 9 and 12 are identical. Lines 17 and 21 are identical. 
大卫·J·马尔兰：是的，把小写和大写 Y 合并起来，小写和大写 N 也是一样。为什么？仅仅因为实际上第 9 行和第 12 行是相同的。第 17 行和第 21 行也是相同的。

And while not a huge deal, if I go in and I change this sentence, odds are, over the course of my lifetime programming, I'm going to forget to change this one even though I changed this one. Or I'm going to forget to change this one and this one. So you don't want the code to get out of sync potentially. And you certainly don't want to repeat yourself. 
虽然不是什么大问题，但如果我进去修改这个句子，在编程生涯中，我可能会忘记修改这个，即使我已经修改了这个。或者我可能会忘记修改这个和这个。所以你不想代码出现潜在的同步问题。你当然不想重复自己。

So "don't repeat yourself" is a tenet of programming, too. If you can avoid that by somehow factoring out some commonality, you should do so, similar in spirit to math when you factor out variables or the like. So let me tighten this up, so to speak. 
“不要重复自己”也是编程的一个原则。如果你能通过某种方式提取共性来避免这一点，你应该这样做，这与数学中提取变量或类似的精神相似。所以让我来简化一下，换句话说。

Let me get rid of what we just did so that it's a little shorter as before. And let me express myself with two conditions using the following syntax. I want to check if c equals equals lowercase y or c equals equals uppercase Y. So you can actually use what's called a logical operator, two vertical bars, which means "or." And we can do this down here, or c equals equals capital N. 
让我把刚才做的去掉，让它变得稍微短一些。让我用以下语法用两个条件来表达自己。我想检查 c 是否等于小写 y 或 c 是否等于大写 Y。你可以使用所谓的逻辑运算符，即两个竖线，表示“或”。我们可以在下面这样做，或者 c 等于大写 N。

So same exact functionality. But to your point, we've now eliminated, what, like another one-- it was, like, 1, 4-- it's eight lines of code now are gone, which is eight fewer lines that I might screw up in this program. Less opportunity for mistakes or bugs, probably a good thing. 
所以功能完全一样。但是说到你的观点，我们现在已经消除了，比如，另一个——就像 1、4 一样——现在只有 8 行代码了，这比之前少了 8 行，这 8 行我可能在这程序中出错的机会更少了。减少错误或 bug 的机会，可能是个好事。

So now, if I run this, let me open my terminal window. Let me run make agree, Enter. "./agree," Enter. Do I agree? Capital Y. Now it seems to be handling both of those situations. So just a little tighter. 
现在如果运行这个，让我打开我的终端窗口。让我运行 make agree，回车。 "./agree"，回车。我同意吗？大写 Y。现在它似乎可以处理这两种情况了。所以更加紧凑了。

As an aside-- we won't use it here-- but if you want to say "and," which would be nonsensical, it, a little confusingly, is two ampersands, means a logical "and," whereby the left thing has to be true and the right thing has to be true. So it's two Boolean expressions at once. 
作为旁白——我们在这里不会使用它——但如果你想表达“和”，这在逻辑上是不合理的，它有点令人困惑，是两个“&”符号，表示逻辑上的“和”，即左边的东西必须是真实的，右边的东西也必须是真实的。所以它同时是两个布尔表达式。

This one makes no logical sense, though, because a character cannot be simultaneously lowercase and uppercase. It's got to be one or the other. So two vertical bars is logically correct. That represents our notion here of "or." Question? No? Yeah. 
这一行没有逻辑意义，因为一个字符不能同时是小写和大写。它必须是其中之一。所以两个竖线在逻辑上是正确的。这代表了我们这里的“或”概念。问题？不？是的。

AUDIENCE: Would you not be able to write or? Does it recognize that? 
观众：您不能写或吗？它识别那个吗？

DAVID J. MALAN: You could not write "or." So I'm saying "or" just because that's a little more normal. But this is incorrect. However-- sneak preview-- in the language of Python, you actually will literally say "or," among other things, which gets a little more user friendly. Other questions on this here? Searching. Yes, in back. 
大卫·J·马尔兰：你不能写“或。”所以我只是说“或”，因为这稍微正常一点。但这是不正确的。然而——预先浏览——在 Python 语言中，你实际上会直接说“或”，以及其他一些事情，这使得它对用户更加友好。这里还有其他问题吗？搜索。是的，在后面。

AUDIENCE: Is there an easier way to-- 
观众：有没有更简单的方法来——

DAVID J. MALAN: Is there an easier way to handle a case sensitivity? Yes, and we'll show you that next week, in fact. So we can combine this code to be even tighter. 
大卫·J·马尔兰：有没有更简单的方式来处理大小写敏感的问题？是的，我们将在下周向大家展示，实际上。因此，我们可以将这段代码结合得更加紧凑。

All right, let's do one final set of examples before taking a cookie break, if we could. But let's go ahead and close agree.c here. Let me open my terminal window. And let's go ahead and implement a virtual cat as we did last week. 
好的，在我们吃饼干休息之前，让我们来做一组最后的例子。不过，我们先关闭这个 agree.c 文件。让我打开我的终端窗口。然后，我们继续实现一个虚拟猫，就像上周那样。

I'm going to code up a file called cat.c. And I'm going to implement this in a few different ways, the first of them pretty foolish. So here, I'm going to include standard io.h. No need for CS50 dot yet-- just yet. 
我将编写一个名为 cat.c 的文件。我将用几种不同的方式来实现它，其中第一种相当愚蠢。所以，这里我将包含 standard io.h。现在还不需要 CS50 dot——还不需要。

int main(void). Inside of these curly braces, let's go ahead and do printf "meow" to get the cat to meow. And then, to save time, I'm going to copy/paste that two more times. So this cat shall meow three times in total. 
int main(void)。在这些花括号内，我们先来执行 printf "meow"，让猫叫一声。然后，为了节省时间，我将复制粘贴两次。所以，这只猫总共会叫三次。

All right, I'm going to go ahead and make the cat, so to speak. All good. "./cat," Enter. And it meows three times, just like our Scratch cat last time. I'll stipulate, this is correct. This is a really well implemented cat correctness-wise. But why is it bad design intuitively, just like last week? 
好的，我将继续制作这只猫，也就是说。一切顺利。输入 "./cat"，回车。它叫了三次，就像上次我们的 Scratch 猫一样。我可以说，这是正确的。这个猫在正确性方面实现得很好。但为什么它从直观上讲就像上周那样设计得不好呢？

AUDIENCE: [INAUDIBLE] [? out. ?] 
观众：[听不清] [？出去。？]

DAVID J. MALAN: Sorry? 
大卫·J·马兰：对不起？

AUDIENCE: Repeating the code. 
观众：重复代码。

DAVID J. MALAN: Sorry. 
大卫·J·马兰：对不起。

AUDIENCE: You keep repeating the code. 
观众：你一直在重复代码。

DAVID J. MALAN: I keep repeating the code. I mean, I literally copied and pasted, which is your first obvious sign. I'm probably doing something wrong if I'm copying and pasting because I'm literally repeating myself. So to spoil it, odds are a loop is probably going to be our friend here. 
大卫·J·马兰：我一直在重复代码。我的意思是，我确实复制粘贴了，这是第一个明显的迹象。如果我在复制粘贴，那可能是因为我在重复自己。所以，提前剧透一下，循环可能就是我们的朋友了。

And so, in fact, in C, we have those features as well. So in the world of C, we can implement some of last week's same ideas in a few different ways. These are a little more mechanical. But suppose we want to repeat something literally three times. Scratch gives us a repeat, a block with an input-- so easy. 
实际上，在 C 语言中，我们也有这些特性。所以在 C 的世界里，我们可以用几种不同的方式实现上周的一些相同想法。这些方法稍微有点机械。但如果我们想字面上重复三次某件事，Scratch 提供了一个重复块，带有输入——非常简单。

C and a lot of languages, it's going to be a little more mechanical. And it's going to look ugly at first. It will take some getting used to. But it is a paradigm you will use again and again and again. This will become very rote memory before long. 
C 和许多语言，它将更加机械。一开始看起来会很丑。需要一些时间来适应。但这是一个你会反复使用的范例。不久之后，这将成为非常机械的记忆。

Well, the most direct translation of this Scratch code to C is probably something that looks a little something like this, whereby I initialize a variable, here called i, and set it equal to 3. That's the code equivalent in C of putting up three fingers. 
好吧，将这段 Scratch 代码直接翻译成 C 语言，可能看起来是这样的，我初始化一个变量，这里叫它 i，并将其设置为 3。这在 C 语言中的代码等同于举起三个手指。

Then what I want to do is, while i is greater than 0, that is to say while I have at least one finger up, go ahead and do the following. And then once I've done that, for instance say "meow" on the screen, I want to go ahead and decrement i and then do this whole thing again. 
然后，我想做的是，当 i 大于 0 时，也就是说当我至少有一个手指举起时，就去做以下操作。然后，当我完成之后，比如在屏幕上显示“喵”，我想继续减少 i，然后再次做整个操作。

Now, I could have called this variable "counter," for consistency with earlier. But it turns out it's conventional when you've only got one variable involved in your code and all it's doing is something simple like counting, you can go ahead and call the variable i for integer, for instance. But it would not be wrong to instead call i "counter." 
现在，我本可以称这个变量为“计数器”，以保持与之前的连贯性。但事实上，当你只有一个变量参与代码，并且它只是做像计数这样简单的事情时，你可以直接称这个变量为 i，比如。但将 i 称为“计数器”也是可以的。

But notice, too, that in this so-called while loop, as we'll start to call it, there is this parenthetical. And that parenthetical is actually itself a Boolean expression. But unlike an if statement, whereby the Boolean expression is evaluated just once and if the answer is true, or yes, you do that thing, the Boolean expression in a while loop here in C is evaluated again and again and again every time you go through the loop to check if you should keep going through the loop. 
但是请注意，在这个所谓的 while 循环中，我们将开始这样称呼它，有一个这样的括号说明。而这个括号说明实际上本身就是一个布尔表达式。但是与 if 语句不同，if 语句中的布尔表达式只评估一次，如果答案是 true 或 yes，你就做那件事，而在 C 语言中的 while 循环中，布尔表达式会再次再次再次评估，每次你进入循环时都会检查你是否应该继续循环。

So for instance, if the goal at hand is to say "meow," well, of course, the comparable C function is going to be printf. And I want to print out on the screen "meow," followed by a new line. Well, what's going on? 
例如，如果当前的目标是输出“喵”，当然，相应的 C 函数将是 printf。我想要在屏幕上打印出“喵”，然后换行。那么发生了什么？

Well, again, I initialize i to 3. I then check, is i greater than 0? And of course it is because effectively, in the computer's memory, three fingers are up. I go ahead and print out "meow." I decrement i, which means to put down one of those fingers. 
又比如，我将 i 初始化为 3。然后检查，i 是否大于 0？当然是的，因为在计算机的内存中，三个手指是举起来的。我继续打印出“喵”。然后我递减 i，这意味着放下一个手指。

And then I check the Boolean expression again. Is 2 greater than 0? Of course it is. So I print out "meow." And then I decrement i, putting down one more finger. Then I check the expression again. Is 1 greater than 0? Of course it is. I print out "meow." 
然后我再次检查布尔表达式。2 是否大于 0？当然是的。所以我打印出 "meow。" 然后我递减 i，放下一个手指。然后我再次检查表达式。1 是否大于 0？当然是的。我打印出 "meow。"

And then I decrement i. And now I'm down to 0. I check again. Is 0 greater than 0? Well, no. And so the loop will automatically, by the definition of how this C code works, terminate for me and proceed to any other lines if there are more lines of code that I've written. 
然后我递减 i。现在我已经减到 0。我再检查一次。0 是否大于 0？嗯，不是。所以根据这个 C 代码的工作定义，循环将自动终止，并继续执行我写的其他代码行。

So how do we actually implement this then in code and get it running? Well, it's going to be pretty much the same idea. Let me go back to VS Code here. I'm going to get rid of all of this copy/paste. And inside of my main function, I'm going to do exactly what we saw-- int i equals 3, semicolon. while i is greater than 0, then go ahead and print out with printf "meow" backslash n. And then be sure you decrement i. 
那么，我们如何在代码中实现这个想法并让它运行呢？嗯，基本上思路是一样的。让我回到 VS Code。我要删除所有的复制粘贴。在我的 main 函数中，我将做我们看到的 exactly-- int i 等于 3，分号。当 i 大于 0 时，就打印出 printf "meow" \n。然后确保你递减 i。

And notice that lines 8 and 9 are not only indented, they are inside of that while loop, so to speak, which means they will both happen again and again and again because what's happening in code here is those curly braces are kind of like the yellow pieces that are hugging the other puzzle pieces in Scratch. It will keep doing this, this, this. 
注意第 8 行和第 9 行不仅缩进了，而且它们实际上位于这个 while 循环内部，换句话说，它们会一次又一次地发生，因为在这段代码中，这些花括号就像 Scratch 中的黄色拼图块一样，紧紧地拥抱其他拼图块。它会一直这样做，这样做，这样做。

But every time, through that loop or cycle, this Boolean expression will be checked again and again and again until the answer is false, at which point the computer is going to jump to the last line. And if there's nothing left, that's it for the program, no more to be done. 
但是，每次通过这个循环或周期，这个布尔表达式都会被检查一次又一次，直到结果为假，此时计算机将跳转到最后一行。如果什么都没有了，那么程序就结束了，没有更多的事情要做。

So same exact idea in Scratch, even though it's a little more mechanical. So that's how we might implement this. And you can think of it, these variables-- this is perhaps a little gratuitous, but let's do this. 
在 Scratch 中，虽然它有点机械，但这个想法是完全一样的。这就是我们可能实现它的方法。你可以这样想，这些变量——这或许有点多余，但让我们这样做吧。

So if you have a variable inside of a computer's memory-- and that's a detail we'll get to in more detail before long-- you can really think of it just as like a container that stores value. So for instance, this clear plastic bowl, it can be thought of as a variable. It just stores values. And right now, there's obviously three stress balls in it. So it represents the number 3. 
所以，如果你在计算机内存中有一个变量——我们很快会详细讨论这个细节——你实际上可以把它想象成一个存储值的容器。例如，这个透明的塑料碗，可以把它看作是一个变量。它只是存储值。现在，显然里面有 3 个减压球。所以它代表数字 3。

So what's really happening in code like this is we've initialized i to 3, which is this bowl. We're then checking the question on line 6. Is i greater than 0? Obviously. So we proceed inside of the curly braces. And we print out "meow." We then decrement i. 
所以，像这样的代码中真正发生的事情是，我们将 i 初始化为 3，这就是这个碗。然后我们在第 6 行检查问题。i 是否大于 0？显然。所以我们进入花括号内部。然后我们打印出"喵"。然后我们递减 i。

So for the sake of unnecessary drama, that's decrementing the variable. So what's being stored in this container now is one less. We do it again, check the count. Nope, 2 is greater than 0. So we keep going-- "meow." 
所以，为了避免不必要的戏剧性，我们在减少变量。所以现在这个容器里存储的是少一个。我们再这样做一次，检查计数。不，2 大于 0。所以我们继续--“喵。”

Decrement i. Check the variable. 1 is greater than 0, so we print "meow." Decrement i. We check the condition again. i is not greater than 0 because 0 is not greater than 0. And so the rest of the code stops executing. 
递减 i。检查变量。1 大于 0，因此我们打印"喵。"递减 i。我们再次检查条件。i 不大于 0，因为 0 不大于 0。因此，代码的其余部分停止执行。

I'm not sure if that was any more effective than fingers on my hand. But we had the bowl. We had the balls. So same exact idea. Variables are just storing some value. And incrementing and decrementing would just be adding or subtracting stress balls in this case. 
我不确定那是否比我的手上的手指更有效。但我们有碗，我们有球。所以完全一样的想法。变量只是存储一些值。增加和减少在这个情况下就相当于添加或减少压力球。

But there's other ways we could do this. In fact, let me zoom in on my code here. And it's not really conventional in programming to count down-- nothing wrong with it, it's just not really a thing. We would typically count up. 
但我们还有其他方法可以这样做。实际上，让我在这里放大一下我的代码。在编程中，倒数并不是常规做法——这没有错，只是不是常规做法。我们通常会向上计数。

So we could alternatively do this-- set i equal to 1 initially. So we count 1, 2, 3, like a normal person. And we can change our condition. If I'm going to count from 1 to 3, what should my comparison be in my Boolean expression here? i is less than 3? Less than or equal to 3, I think. 
所以我们可以选择这样做——初始时将 i 设置为 1。所以我们数 1、2、3，就像普通人一样。我们可以改变我们的条件。如果我要从 1 数到 3，我的布尔表达式中的比较应该是什么？i 小于 3？还是小于等于 3，我觉得。

So if i is initialized to 1, we're going to go through this one time, two times, three times. i is going to eventually get incremented to 4. But at that point, 4 is not less than or equal to 3. So it's only going to execute a total of three times. But there's still a bug in this code. What other line needs to change? 
所以如果 i 初始化为 1，我们将通过一次、两次、三次。i 最终会增加到 4。但那时，4 不小于等于 3。所以它总共只会执行三次。但代码中仍然有一个错误。还有哪一行需要更改？

AUDIENCE: Plus plus.   AUDIENCE: 加加。

DAVID J. MALAN: Yeah, so line 9 needs to become plus plus. So this code is just as correct. And honestly, you could-- reasonable people will disagree. Your TF might say do it this way and not this way. But this is still correct. But it's not the most conventional way. 
大卫·J·马兰：是的，所以第 9 行需要变成加加。所以这段代码同样是正确的。而且说实话，合理的人可能会有不同的看法。你的 TF 可能会说这样做而不是那样做。但这仍然是正确的。但这不是最传统的方式。

As per last week, computer scientists and programmers generally, actually, start counting from 0 by convention for reasons we'll soon see. So the better way, the more conventional way arguably, would be always start counting from 0. Count up to but not through the number you care about. 
就像上周一样，计算机科学家和程序员通常，实际上，按照惯例从 0 开始计数，原因我们很快就会看到。所以更好的方式，可以说是更传统的方式，就是始终从 0 开始计数。数到但不包括你关心的数字。

And so this form of the code is probably the most popular way to do it. Start at 0, count up to 3 but not through 3, as with less than or equals than. All three are correct. Can't really do counting up as easily with the bowl without picking up the balls. But the exact same logic applies. 
因此，这种代码形式可能是最流行的方式。从 0 开始，数到 3 但不包括 3，就像小于等于一样。三者都是正确的。没有球碗，很难轻松地数数，但逻辑是相同的。

And in fact, this version of the code is so commonly done that there's a different way to implement it all-- there's a similar way to implement it all together. In fact, this code here-- same exact thing, repeating three times-- because it's so commonly done that you want to initialize something to 0 and keep doing something until the value 3, you can actually use a different preposition, for, which is another keyword in C. And it looks a little more cryptic. But it just tightens things up. 
事实上，这个版本的代码如此常见，以至于有另一种方式来实现所有这些--有类似的方式来实现所有这些。事实上，这里的代码--完全相同，重复了三次--因为它太常见了，所以你想要将某个值初始化为 0，然后一直执行直到值为 3，你实际上可以使用另一个介词“for”，这是 C 语言中的另一个关键字。它看起来有点晦涩。但它只是使事情更紧凑。

This is what's called a for loop. Previous is what's called a while loop. And honestly, even though it, probably to the newbie, still looks just as cryptic, it's just a little tighter because you're expressing all of these ideas on one line. 
这就是所谓的 for 循环。之前的则是 while 循环。说实话，即使是对于新手来说，它可能看起来仍然很晦涩，但它只是稍微紧凑一些，因为你在一行中表达了所有这些想法。

You specify the variable you want to create and initialize. You specify the Boolean expression you want to check again and again. You specify what increment or decrements you want to happen. 
您指定要创建和初始化的变量。您指定要反复检查的布尔表达式。您指定要发生的递增或递减操作。

And confusingly, you do use semicolons here, not commas. You do not put a semicolon here. You, of course, don't put them after these things. You generally only put them after functions thus far. So we do have one semicolon here. 
并且令人困惑的是，你在这里确实使用了分号，而不是逗号。你在这里不使用分号。当然，你当然不会在这些东西后面使用它们。到目前为止，你通常只在函数后面使用它们。所以这里确实有一个分号。

But in short, this you'll get more comfortable with. This is how I, for instance, almost always write a loop. But it's doing the exact same thing mechanically as this, same thing as counting on your fingers, same thing as counting the stress balls. There's just different ways to express the exact same idea. 
简而言之，你会越来越习惯这一点。比如，我几乎总是这样写循环。但它机械地做的是完全一样的事情，就像用手指计数一样，就像数压力球一样。只是表达同一个想法的不同方式。

But there are ways to screw up. So in fact, let me go ahead and do this. Suppose that the cat-- we'd like the cat to live as long as possible. And we don't want it to stop meowing after just three or a finite number of times. How can you do something forever, again and again and again? 
但有出错的方法。所以实际上，让我先做这个。假设我们想让猫尽可能长寿。我们不想它在叫了三次或有限次数后就停止叫。你怎么能永远重复做同样的事情呢？

Well, let me go back into VS Code here. Let me delete all of the code from earlier. And let me go ahead and say, while something is true-- I'll come back to that-- let's just go ahead and print out "meow" backslash n ideally forever. 
好吧，让我回到 VS Code 这里。让我删除之前所有的代码。然后，让我先说，当某个条件为真时——我会回来解释——让我们先打印出“喵”并理想地永远打印。

But what do I want to put in here? Well, if I want to do something forever, I could do something kind of stupid, like while 1 is less than 2, which is always going to be the case, or while 50 is less than 51, which is always going to be-- I could just ask an arbitrary question. But arbitrary-- not good in general. You should have meaning behind your code. 
但我想在这里放什么？如果我想永远做某事，我可以做一些很愚蠢的事情，比如 while 1 小于 2，这永远都会是这种情况，或者 while 50 小于 51，这永远都会是——我可以问一个任意的问题。但任意的问题通常是不好的。你的代码应该有含义。

So if you want the expression to be true all of the time, just say "while true," because true is not changing anytime soon. If it's literally true, it's always going to be true. The only caveat is to use this trick. For now, you will need to include the CS50 library, which for today's purposes makes that possible. 
所以如果你想使表达式始终为真，只需说“while true”，因为真不会在短时间内改变。如果它是字面上的真，它将始终为真。唯一的注意事项是使用这个技巧。目前，你需要包含 CS50 库，这对于今天的用途来说使得这成为可能。

But there's a problem, of course. If the cat's going to live forever, if I do make cat, "./cat," Enter, you can very quickly lose control over your terminal window. And you can see the meows are flying across the screen, at least based on the bottom from what we're seeing. This cat will never stop meowing. 
但当然有问题。如果猫要永远活着，如果我创建了猫，"./cat"，回车，你很快就会失去对终端窗口的控制。你可以看到喵喵声在屏幕上飞舞，至少基于我们看到的底部。这只猫永远不会停止喵喵叫。

And this is either a feature or a bug, so to speak, depending on how long the cat here should live virtually. But how do you terminate a program that is out of control like this, infinitely? So one of the takeaways for today is Control-C is your friend for cancel or interrupt the program. 
这要么是一个特性，要么是一个 bug，具体取决于这只猫在虚拟世界中应该活多久。但如何终止这种失控的程序，无限期地？所以今天的收获之一是，Control-C 是你的朋友，用于取消或中断程序。

If you ever lose control over a program because you've got intentionally or unintentionally an infinite loop, you can go into your terminal window, hit Control-C, sometimes multiple times if it's ignoring you. And that will break out of the program and just essentially force-quit it, like in Macs or PCs. 
如果你因为有意或无意地陷入无限循环而失去了对程序的控制，你可以进入终端窗口，按住 Control-C，有时可能需要多次，如果它没有响应的话。这样就可以退出程序，就像在 Mac 或 PC 上强制退出一样。

But let's make one improvement here still. The last thing we did with our cat in Scratch before now-- we'll take a break in a moment-- was we defined our own functions. And recall that we did that to abstract away the idea of meowing because Scratch didn't come with a meow puzzle piece. C definitely does not come with a meow function. We have to implement it ourselves. 
但我们还可以在这里做一些改进。在我们之前在 Scratch 中为我们的猫所做的最后一件事——我们稍后会休息一下——是我们定义了自己的函数。回想一下，我们之所以这样做是为了抽象出“喵喵叫”的概念，因为 Scratch 没有自带“喵喵叫”的拼图块。C 语言肯定也没有“喵喵叫”函数。我们必须自己实现它。

So quickly, toward the end of week 0, we did this-- define a function called meow that just plays the meow sound. And now we have a meow puzzle piece we can use and reuse. In C, we're about to do this. And this is going to look a little cryptic. But it's going to lay the foundation for future weeks when we do this even more. 
所以，在第一周的最后几天，我们做了这件事——定义一个名为“meow”的函数，它只播放“喵喵叫”的声音。现在我们有一个可以重复使用的“喵喵叫”拼图块。在 C 语言中，我们即将这样做。这看起来可能有点晦涩难懂。但它将为未来几周我们做更多的事情奠定基础。

I've got a meow function, weird mentions of void. That just means there's no input and there's no output for this function. It just does one thing simply. And that one thing is printf, "meow." 
我有一个“meow”函数，提到了“void”。这仅仅意味着这个函数没有输入也没有输出。它只是简单地做了一件事。那就是打印“meow”。

So how do I use this here code? Here, in Scratch, is how we used it last week. When the green flag is clicked, repeat three times the meow function. 
那么，我该如何使用这里的代码呢？在 Scratch 中，我们上周就是这样使用的。当绿色标志被点击时，重复三次“喵”函数。

In C, it's going to look like this-- int main(void) and all of that. And I can use a for loop, a while loop. I'm copying and pasting for loop version of the code. Set i equal to 0. Make sure it stays below 3. Increment it on each iteration, or cycle. And just call meow. 
在 C 语言中，它看起来会是这样-- int main(void)等等。我可以使用 for 循环、while 循环。我在复制粘贴 for 循环版本的代码。将 i 设置为 0。确保它保持在 3 以下。在每次迭代或循环中递增它。然后调用“喵”。

So what's nice here is that we have, fairly simply, a way in C to create our own functions called meow or anything else that lines up perfectly with what we did in Scratch. We'll take some time to get comfy with the syntax and remember it, have to look it up frequently for reference. But let's go ahead and actually do this. 
这里很棒的是，我们可以在 C 语言中非常简单地创建自己的函数，比如“喵”或其他与我们在 Scratch 中做的完美匹配的函数。我们将花些时间熟悉语法并记住它，需要经常查阅以供参考。但让我们先做这个。

If I go back to VS Code, clear my screen-- let me hide my terminal window temporarily. Let me go ahead and invent this meow function. Per the code earlier, I'm going to go ahead and do this-- void meow(void). And again, the two voids mean no input, no output. It just does one thing well. printf, quote, unquote, "meow" backslash n. 
如果我回到 VS Code，清空我的屏幕-- 让我先暂时隐藏我的终端窗口。让我先发明这个“喵”函数。按照之前的代码，我会这样做-- void meow(void)。再次，两个 void 表示没有输入，没有输出。它只擅长做一件事。printf，引号“喵”反斜杠 n。

And now, down here, I can use a for loop. So for-- and I know this from memory-- int i equals 0; i less than 3; i plus plus. And then, inside of curly braces, I'm going to go ahead and call the meow function. 
现在，在这里，我可以使用一个 for 循环。所以 for--我记得这个--int i = 0; i < 3; i++. 然后，在花括号内，我将调用 meow 函数。

Notice, when I'm creating the function up here, I explicitly, pedantically, say void void, no input, no output. When I use the function on line 13, you just say open parentheses, close parentheses. That's the equivalent of a Scratch puzzle piece without a white oval. You just put nothing there. You don't put the word "void." 
注意，当我在这里创建函数时，我会明确地、严格地说 void void，没有输入，没有输出。当我使用这个函数在第 13 行时，你只需要写上括号，然后关闭括号。这相当于一个没有白色椭圆的 Scratch 拼图块。你什么都不需要放，不需要写“void”这个词。

So that's it. Let me open my terminal window. Let me run make cat to recompile-- "./cat." And I think I have a working cat. Now, this is correct. The only thing I don't love about this version, if I hide my terminal window, is that when I start writing bigger and bigger programs, it'd be nice if my main function, which I told you to take on faith for today, is at the top of the file, if only because literally the name "main" means this is the main part of my program. 
好了，让我打开我的终端窗口。让我运行 make cat 来重新编译--"./cat"。我想我已经有了可以工作的 cat。现在，这是正确的。唯一我不喜欢这个版本的地方，如果我隐藏我的终端窗口，那就是当我的程序越来越大时，如果我的 main 函数，也就是你今天让我相信的那个函数，能放在文件顶部就太好了，因为“main”这个名字本身就意味着这是程序的主要部分。

It'd be nice if it's the first thing I see, which is to say, just to be pedantic, it's very common to put any functions you write at the bottom of your file, maybe alphabetically, maybe organized some other way. But you put main first by convention, just like the "when the green flag clicked." It was the first thing you always started with last week. 
如果它是你首先看到的东西，那就意味着，严格来说，将你编写的任何函数放在文件底部是很常见的，可能是按字母顺序，也可能是按其他方式组织。但按照惯例，你首先放置 main 函数，就像“当绿色标志被点击时。”这是你上周开始时总是首先考虑的事情。

But watch what happens now. If I go into my terminal window-- and Command-- or Control-J is hiding and showing it, if you are curious. But probably, you'll just leave it open on your own all the time. Let me do make cat again. 
但看看现在会发生什么。如果我进入我的终端窗口——命令或控制-J 可以隐藏和显示它，如果你好奇的话。但可能你只是会一直让它打开。让我再次创建 cat。

And, huh, I've screwed up somehow. All I did was move the meow function from top to bottom. And I'm getting "call to undeclared function 'meow,'" something, something, something. Well, what's going on? 
然而，我好像出了点问题。我做的只是把 meow 函数从顶部移动到底部。现在我得到了“未声明函数'meow'”的错误信息。这是怎么回事呢？

Well, C is pretty naive and simplistic. It's only going to do what you tell it to do. And it's only going to do things top to bottom, left to right. And unfortunately, on line 8, you are telling C, call a function called meow. But that does not exist in CS50's header file. That does not exist in standard io's header file. It exists at the bottom of my file, at which point it's too late because I'm trying to use it before it exists. 
嗯，C 语言相当天真和简单。它只会做你告诉它做的事情。它只会从上到下、从左到右执行事情。不幸的是，在第 8 行，你告诉 C 调用一个名为 meow 的函数。但在 CS50 的头文件中不存在这个函数。在标准 io 的头文件中也不存在。它在我的文件底部存在，但那时已经太晚了，因为我试图在使用它之前调用它。

So I could just undo that and put this meow function at the top of the file. But you're going to eventually get into a perverse scenario where you can't put all of your functions above all of your functions. You've got to pick a lane at some point. 
所以我可以选择撤销这个操作，将这个 meow 函数放在文件顶部。但最终你会遇到一个奇怪的情景，你不能把所有的函数都放在所有函数的上面。你必须在某个时候选择一条路线。

So the solution to this, albeit a little weird-- and the one time in CS50, in programming, that it is encouraged and necessary to copy/paste-- is what you can do at the top of your code, above main, is just copy/paste the first line of your own function. This is the so-called prototype of the function. And it simply describes how to use the function. 
所以这个解决方案，虽然有点奇怪——在 CS50 编程中，这是唯一一次鼓励和必要的复制粘贴——你可以在代码顶部，在 main 之前，复制粘贴你自己的函数的第一行。这就是所谓的函数原型。它简单地描述了如何使用该函数。

And funny enough, we actually saw this earlier. But I kind of swept it under the rug. A moment ago, or a bit ago, when we looked at standard io.h and we looked at the printf function in the manual pages, I highlighted the header file. But I also glossed over the so-called prototype, which is-- sorry-- the first line of the printf function, just as this is the first line of my meow function. 
很有趣，我们之前确实见过这个。但我把它当作没看见。就在刚才，或者说是刚才，当我们查看标准 io.h 文件，并查看手册中的 printf 函数时，我指出了头文件。但我也没有仔细看所谓的原型，也就是 printf 函数的第一行，就像这是我的 meow 函数的第一行一样。

This is like a little clue. This is like saying to C, hey, there's going to be a function called meow that takes no input, has no input-- takes no input, has no output. Just know that it exists eventually. And that will satisfy the compiler because if I go back to my terminal, rerun make cat, it now knows on faith, per line 4, this function will eventually exist. 
这就像一个线索。这是在告诉 C 语言，有一个名为 meow 的函数，它没有输入，也没有输出。只需知道它最终会存在。这样编译器就会满意，因为如果我回到我的终端，重新运行 make cat，它现在就会相信，根据第 4 行，这个函数最终会存在。

And indeed, once it gets to the bottom of my code, line 14 onward, there it, in fact, is. So you just copy the one-and-only first line of your function's code to the top, called a prototype. And now if I do "./cat," I get, finally, "meow," "meow," "meow" yet again in this case. Questions on these here cats? No? 
确实如此，一旦代码运行到我的第 14 行以下，那里就出现了。所以你只需把函数代码的唯一第一行复制到顶部，称为原型。现在，如果我运行"./cat"，最终我会再次看到“meow”，“meow”，“meow”。关于这些猫有什么问题吗？没有？

All right, then the last flourish before-- I keep promising cookies. And I promise they exist. So last flourish-- just as we did in Scratch-- so in Scratch, recall that we parameterized our meow function by letting us tell meow how many times to meow so that we didn't need to use our loop inside of our "when green flag clicked" block. 
好吧，那么最后的点缀之前——我一直在承诺饼干。我保证它们存在。所以最后的点缀——就像我们在 Scratch 中做的那样——在 Scratch 中，回想一下，我们通过让 meow 函数接受要 meow 的次数来参数化我们的 meow 函数，这样我们就不需要在“当绿旗点击”块中使用循环了。

In other words, if I want to actually have the cat meow a specific number of times, I can actually go ahead and do that proactively with some of my own code such as this here in Scratch. When I edited my meow function last week in Scratch, I specified that I want it now to take an input called n, which represents some number of times. 
换句话说，如果我想让猫真正地叫出特定的次数，我实际上可以用一些自己的代码来主动实现这一点，比如这里在 Scratch 中的代码。上周我编辑 Scratch 中的 meow 函数时，指定了现在要它接受一个名为 n 的输入，代表次数。

And I changed my repeat block not to be 3 perpetually, but to actually have n generally baked in there instead. Or actually, instead of just saying play sound "meow," I had a repeat block using n as the placeholder instead of a hard coded 3. 
我把重复块改为不再无限重复 3 次，而是将 n 一般性地嵌入其中。或者实际上，我不再只是说播放声音“喵”，而是用一个重复块，用 n 作为占位符而不是硬编码的 3。

So how can I now use this in C? In C, It's almost the same. It's still void at the beginning of my function name, which means no output still. It only has side effects. But what did change vis-谩-vis the previous version of meow? What has changed? 
那我现在如何在 C 语言中使用这个呢？在 C 语言中，几乎一样。函数名开头仍然是 void，这意味着没有输出，只有副作用。但是与之前的 meow 版本相比，有什么变化呢？有什么变化？

AUDIENCE: [INAUDIBLE]   观众：[听不清]

DAVID J. MALAN: Exactly. Instead of saying "void" a second time in parentheses, it literally says "int n" inside of those parentheses, which means, in C, this function called meow takes input. It means the exact same thing as the pink on the left. 
DAVID J. MALAN: 确实。在括号中不是第二次说 "void"，而是直接在括号内说 "int n"，这意味着在 C 语言中，这个名为 meow 的函数接收输入。这与左侧的粉红色表达的意思完全相同。

And again, this is why we keep emphasizing the Scratch blocks. Like, no new ideas with a lot of these features. It's just different syntax that you'll get used to over time. So if I go back into VS Code here and I change this function, let's do that. 
再次强调，这就是为什么我们一直强调 Scratch 块。就像，这些功能没有太多新想法。只是随着时间的推移，你会习惯不同的语法。所以，如果我回到 VS Code 这里，并更改这个函数，让我们来做一下。

Let's change my prototype to be int n, where n represents some number of times. Let's change the actual function on line 14 to also have int n here. And let's actually move the for loop from main into the meow function such that I now have my curly braces here. I have my print statement inside of those curly braces. 
让我将原型更改为 int n，其中 n 代表一些次数。让我们将第 14 行的实际函数也改为包含 int n。并且让我们将 for 循环从 main 函数移动到 meow 函数中，这样我现在就有我的花括号了。我在花括号内有打印语句。

And now, in main, I can get rid of all of that code. Just say "meow" any number of times, like three. And just like I did with Scratch, let me hit Enter an arbitrary number of times. Sort of out of sight, out of mind. Now the essence of my program is one real line of code-- "meow" three times-- because I've abstracted away the idea of meowing and told the cat, instead, exactly how many times to meow by way of that function. 
现在，在主函数中，我可以摆脱所有这些代码。可以说“喵”任意次数，比如三次。就像我处理 Scratch 一样，让我任意次数地按 Enter 键。有点儿眼不见心不烦。现在，我的程序的核心就是一行真正的代码——“喵”三次——因为我已经抽象出了喵喵叫的概念，并通过那个函数告诉猫具体喵叫多少次。

OK, I can't keep stringing along cookies so long. Let's go ahead and take a 10-minute break here. And when we come back, more cats, more code. 
好的，我不能一直连续吃饼干这么久。我们在这里休息 10 分钟吧。等我们回来，更多猫，更多代码。

All right. So we are back. And I want to add one final flourish to this program because now, more so than a lot of the examples, now the programs are starting to grow in length. And indeed, soon there'll be a few dozen lines of code, which is not uncommon. 
好的，所以我们又回来了。我想在这个程序中添加一个最后的点缀，因为现在，与很多例子相比，程序开始变长了。的确，很快就会有几十行代码，这并不罕见。

But let's suppose that we want to stop hard-coding 3 everywhere and actually prompt the user for some number of meows here. Well, let me do this. In VS Code, I'm going to go ahead and get rid of this one line for now. And let's do something like this. Let's ask the user for an integer. 
假设我们不想在所有地方都硬编码 3，而是提示用户输入一些喵喵的数量。让我来做这个。在 VS Code 中，我现在先去掉这一行。让我们这样做。让我们询问用户一个整数。

So int, maybe n for number, equals get_int. And we'll say something like just "Number" to give a number of meows. And then we'll go ahead and actually call meow, passing in not 3 this time, but passing in n. So we are using the return value of get_int to store it in a variable called n on line 8. And then we are passing n as the input, or argument, to the function called meow on line 9. 
所以 int，也许用 n 表示数字，等于 get_int。我们会说“数字”来表示喵喵的数量。然后我们实际上调用 meow 函数，这次不是传递 3，而是传递 n。所以我们在第 8 行使用 get_int 的返回值存储在变量 n 中。然后我们在第 9 行将 n 作为输入或参数传递给 meow 函数。

And again, the actual implementation of meow on line 22 onward, who cares? Out of sight, out of mind. Once it exists, we can abstract it away mentally. But I'll keep it up tight here anyway. 
再次，meow 函数的实际实现从第 22 行开始，谁在乎呢？眼不见为净。一旦存在，我们就可以在心理上将其抽象化。但我会在这里保持它紧凑。

All right, so let me go ahead and open my terminal window-- make cat, "./cat," "Number"-- I can still type in 3, and it works. Or I can go ahead and type in 5. "Meow," "meow," "meow." But, hm, it's not actually meowing five times. Why? [WHISPERS] I didn't realize this either, but there's a bug. 
好的，那么我先打开我的终端窗口——创建一个名为“cat”的文件，“./cat”，“数字”——我仍然可以输入 3，并且它正常工作。或者我可以输入 5。 “喵喵喵”，“喵喵喵”，“喵喵喵。” 但是，嗯，实际上并没有喵喵叫五次。为什么？[低声] 我也没有意识到这个问题，但这里确实有一个 bug。

AUDIENCE: [INAUDIBLE]   观众：[听不清]

DAVID J. MALAN: Yeah, exactly. So the for loop, when I copy/pasted it before, before break, I actually got lazy and I forgot to change the 3 to an n so that it matches the name of the argument that's being passed into meow. So that was a bug-- unintentional on my part. But we have now fixed it here. And now we are passing this in from main to meow. 
大卫·J·马尔安：是的，正是这样。所以 for 循环，在我之前复制粘贴的时候，在 break 之前，我实际上有点偷懒，忘记把 3 改为 n，以匹配传递给“meow”的参数名称。所以这是一个 bug——这是我不小心犯的。但现在我们已经在这里修复了它。现在我们从 main 传递这个参数给 meow。

So if I make cat, "./cat", and type 5 this time, I indeed get five meows. But it's worth noting there's some subtleties here in my code in that I've used n a couple of times. So this is actually deliberate, that I've used n twice in this way, to induce a bit of confusion. But it turns out this n is actually not the same as this n, nor this one. So what's going on here? 
所以如果我创建一个名为“cat”的文件，“./cat”，这次输入 5，我确实得到了五次喵喵叫。但值得注意的是，在我的代码中存在一些细微之处，我使用了 n 几次。所以实际上我是故意这样使用 n 两次，以引起一些困惑。但结果是，这个 n 实际上并不等同于这个 n，也不是这个 n。那么这里到底发生了什么？

Well, it turns out, in programming, there's often this idea of scope. And long story short, generally speaking, variables only exist in the scope in which you create them. More down to Earth, variables only exist inside of the curly braces in which you define them. 
嗯，结果是，在编程中，常常有这种“作用域”的概念。简而言之，一般来说，变量只存在于你创建它们的那个作用域中。更具体地说，变量只存在于你定义它们的那个花括号内。

So for instance, suppose I got a little sloppy and suppose I didn't bother giving meow an input and I didn't bother giving its prototype an input and I just used n on line 14 because, why? Well, I already defined n on line 8. 
比如说，如果我有点粗心大意，没有给 meow 输入，也没有给它的原型输入，我只是在第 14 行使用了 n，为什么呢？因为我在第 8 行已经定义了 n。

So this is just an alternate universe in which I'm not changing meow to take input. I'm just using n in two different functions, in main on line 8 and 9-- actually, I don't even need that-- on line 8 and 9 and also again on line 14. 
所以这是一个平行宇宙，在这个宇宙里，我没有改变 meow 来接收输入。我只是在使用两个不同的函数中的 n，在 main 函数的第 8 行和第 9 行——实际上，我甚至不需要那个——在第 8 行和第 9 行，还有第 14 行。

This code will not work. The compiler will not like this. Why? Because n does not exist inside of meow. Why? Per the heuristic I offered, n exists only inside of the curly braces in which it was defined, namely these curly braces here. 
这段代码将无法工作。编译器不会喜欢这样。为什么？因为 n 在 meow 内部不存在。为什么？根据我提供的启发式方法，n 只存在于它被定义的花括号内，也就是这里的花括号。

So n is in scope in main, so to speak. But it is not in scope in meow. And that's why we have to jump through these hoops and use inputs and outputs and inputs and outputs and pass things around among functions without sharing things across functions instead. 
所以说，n 在 main 中是有作用的，但它在 meow 中却没有。这就是为什么我们必须跳过这些障碍，使用输入和输出，输入和输出，在函数之间传递东西，而不是在函数之间共享东西。

Now, I could clarify this and maybe change my argument here from n to times. If I want to make clear that, oh, this is the number of times I want meow to be said, I don't have to use n for both. But just realize that, if you do, it's just a coincidence. They are not usable in two different scopes. 
现在，我可以澄清这一点，也许可以改变我的论点，将 n 改为 times。如果我想明确指出，哦，这是我想让 meow 说的次数，我不必在两者都使用 n。但请记住，如果你这样做，那只是巧合。它们不能在两个不同的作用域中使用。

All right, let's do one other thing, though. Let's not only prompt the user for the number here, let's make sure that it makes sense what number they give us. So if I do make cat-- just to clean things up-- "./cat," suppose I type 0, OK, I suppose that's correct. If I say meow 0 times and it doesn't meow at all, that's arguably correct. 
好吧，我们再做一些其他的事情。不仅要求用户输入数字，还要确保他们给出的数字是有意义的。所以，如果我创建一个 cat，为了清理一下，“./cat”，假设我输入 0，好吧，我想这是正确的。如果我让我 say meow 0 次，它一点声音都不发，这也是可以接受的。

But if I type in something like negative 5, it ignores me, which I guess is better than crashing or freezing or something. But ideally, it might be nice to handle this situation. And if they give me a negative number, prompt them again for a positive number. Prompt them again for a positive number. Make the program make sense. 
但是如果我输入像负五这样的数字，它会忽略我，我想这比崩溃或冻结要好。但理想情况下，处理这种情况可能更好。如果他们给我一个负数，就再次提示他们输入正数。再次提示他们输入正数。让程序更有意义。

So how could we do that? Well, a couple of ways. If I go back into my code here, I could do this. I could maybe do something like a loop or-- let's see. So if I get n, so if n is less than 1, then it makes no sense. 
我们该如何实现呢？嗯，有几个方法。如果我回到我的代码这里，我可以这样做。我可能可以做一些像循环这样的东西——让我们看看。所以如果得到 n，那么如果 n 小于 1，那就没有意义。

So what do I want to do if n is less than 1? Well, I could just prompt the user again. And I say, OK, let's get n again. And then I can say, if n is less than 1, what do I want to do? I guess we could ask the user again. And then if n is less than 1, I could just, again-- I can give them three tries, four tries to get this right. 
如果 n 小于 1，我想做什么呢？嗯，我可以再次提示用户。我说，好吧，让我们再次获取 n。然后我可以这样说，如果 n 小于 1，我想做什么？我想我们可以再次询问用户。然后如果 n 小于 1，我再次可以——我可以给他们三次、四次尝试来正确地完成这个。

This is obviously stupid. I'm copying and pasting. I'm repeating myself. There's no end in sight. I can't do this forever, surely. So this just feels like the wrong solution. So there are different ways to solve this problem. And funny enough, a while loop is not really the best way. 
这显然很愚蠢。我在复制粘贴。我在重复自己。没有尽头。我肯定不能永远这样做。所以这感觉像是一个错误的解决方案。所以解决这个问题的方法有很多。有趣的是，while 循环并不是最好的方法。

A do while loop is-- agh-- a while loop is not the best way. A for loop is not the best way. It turns out there's one other type of loop that we want to introduce that's super useful for getting user input, potentially, again and again and again so that the user cooperates. 
当循环（do while loop）并不是最佳选择。for 循环也不是最佳选择。实际上，还有一种循环类型，它对于获取用户输入非常有用，可以反复使用，以便用户能够合作。

Specifically, what I'm going to do is this. I'm going to literally say, do the following while something is true. So it's more of a mouthful. I'm spreading it out over multiple lines. 
具体来说，我将这样做。我会字面地表达，当某个条件为真时执行以下操作。所以这有点罗嗦。我把它分散在多行中。

But what am I going to put inside of the do block here? I'm going to say int n equals get_int and ask for that number as before, closed quote, semicolon. And I'm going to keep asking while-- sorry, accidental Enter-- while n is less than 1, semicolon. 
但是我在这里的 do 块中要放什么？我要说 int n = get_int，像之前一样请求这个数字，关闭引号，分号。并且我会一直请求，直到——抱歉，按错了 Enter——直到 n 小于 1，分号。

So notice the semantics of this. Even though it's a little weird-looking, it does read, in English, do the following. Get an int stored in n. And keep doing that while n is less than 1. 
注意这个语义。尽管它看起来有点奇怪，但它确实可以读作，用英语来说，执行以下操作。将一个整数存储在 n 中。并且当 n 小于 1 时，继续这样做。

But this code as written is not quite going to work yet. Let me try opening my terminal window. Make cat, Enter. Ugh, damn it-- "Use of undeclared identifier 'n.'" Well, here's where the line number is helpful. 
但这段代码目前还不能正常工作。让我试试打开我的终端窗口。输入 cat，回车。哎呀，见鬼了--“未声明标识符‘n’。”嗯，这里行号就派上用场了。

The line number is indicated here, 12. And it's repeated here, 12. So I clearly screwed up at line 12. But there's not that much going on at line 12. Why is n "undeclared" in line 12 even though I literally just declared it in line 10? 
行号在这里显示，12。这里也重复了，12。所以我显然在 12 行出了问题。但 12 行并没有什么复杂的操作。为什么 n 在 12 行被标记为“未声明”，尽管我在第 10 行刚刚声明过它？

AUDIENCE: Because it's [INAUDIBLE] inside of the [INAUDIBLE] line 10, not outside. 
观众：因为它在[听不清]的[听不清]行 10 内，而不是外面。

DAVID J. MALAN: Exactly, because I declared n inside the scope of the do block, so to speak, inside the curly braces on lines 9 and 11. That variable n no longer exists by the time we get to line 12. It'd be great if it did, but it doesn't because it violates that heuristic I proposed, which is that variables only exist in the scope of the curly braces in which they were defined. 
大卫·J·马尔安：没错，因为我把 n 声明在了 do 块的范围内，换句话说，就在第 9 行和第 11 行的花括号内。那个变量 n 在我们到达第 12 行时已经不存在了。虽然它应该存在，但它不这么做，因为它违反了我提出的那个启发式原则，即变量只存在于它们被定义的花括号范围内。

So how do I fix this? Well, it turns out you can declare a variable in advance outside of one scope but then define it, that is initialize it, elsewhere. So the solution here is actually this. Inside of the loop, just set an equal to the return value of get_int. But per the heuristic, you've got to declare n, make it exist inside of the outermost scope of this function. 
那么，我该如何解决这个问题呢？实际上，你可以在一个作用域之外提前声明一个变量，然后在其他地方定义它，也就是初始化它。所以这里的解决方案实际上是这个。在循环内部，只需将一个等于 get_int 的返回值赋值即可。但是根据启发式方法，你必须声明 n，使其存在于这个函数的最外层作用域中。

So it's a little weird. And we're kind of breaking this down into two steps. But this is valid, recommended, correct C code. You declare a variable without giving it any value initially. And then, in line 11, you proceed to give it a value, potentially again and again and again. 
这有点奇怪。我们把它分解成两步。但这确实是有效的、推荐的、正确的 C 代码。你声明一个变量而不给它赋初值。然后在第 11 行，你继续给它赋值，可能一次又一次。

Now, what's useful about a do while loop? So a do while loop, as the name implies, will do something no matter what. But it will potentially do it again and again and again while some question is true, like n being less than 1 in this case. 
那么，do-while 循环有什么有用的地方呢？正如其名所示，do-while 循环无论如何都会执行某些操作。但是，如果某个条件为真，比如 n 小于 1，它可能会一次又一次地执行。

As an aside, why did we not do a while loop? Well, let's think about that. While n is less than 1-- but wait a minute. n doesn't have a value. OK, so I guess we have to go back to doing get_int, number, colon, semicolon. OK. 
作为补充，为什么我们没有使用 while 循环呢？让我们来考虑一下。当 n 小于 1 时——但是等等。n 没有值。好吧，我想我们不得不回到 get_int，数字，冒号，分号。好吧。

But while n is less than 1, we're back to the same problem where we have to repeat ourselves again. So this is why for loops, while loops, not the right solution when you want to do something at least once but potentially again and again. 
但是当 n 小于 1 时，我们又回到了同一个问题，不得不再次重复自己。这就是为什么当你想要至少做一次，可能反复做的时候，for 循环和 while 循环并不是正确的解决方案。

So the right solution here, again, is this new and final looping construct-- I'm just hitting Control-Z a lot-- whereby we've done it as follows. All right, let's try this. Clear the screen. make cat, Enter. "./cat." 
所以正确的解决方案在这里，再次强调，是这种新的最终循环结构——我只是经常按 Control-Z——我们是这样做的。好吧，让我们试试。清屏。make cat，回车。"./cat。"

Let's type in 5. Still works. Let's type in negative 5. And notice it doesn't just ignore me. It prompts me again and again and again. Even if I type in 0, I've got to at least give it a positive integer. 
让我们输入 5，仍然可以工作。让我们输入负 5。注意它并没有忽略我。它会一次又一次地提示我。即使我输入 0，我也至少需要提供一个正整数。

Well, this actually seems kind of a common paradigm. What if we want to prompt the user for a positive number in other programs too? We're nearing the point already, even after just week 1, where it'd be nice to write our own reusable functions that solve common problems. And eventually, maybe we can put them in header files as well. 
实际上，这似乎是一种常见的模式。如果我们想在其他程序中提示用户输入正数怎么办？在仅仅第一周之后，我们已经开始接近这个点了，写一些可以重复使用的函数来解决常见问题会很好。最终，也许我们可以把它们放在头文件中。

But for now, let's go ahead and do this. I'm going to actually copy all of this code. And I'm going to create one more function in this file below main called get_positive_int, for integer. And I'm going to specify that it doesn't need any input because the only thing this function is going to do is that exact same thing. 
但现在，让我们继续做这件事。我将实际复制所有这些代码。我将在文件中创建一个名为 get_positive_int 的函数，用于整数。我将指定它不需要任何输入，因为这个函数将要做的正是这件事。

So notice that I've just moved my code from main into a function that's name describes what it does, "get_positive_int." I'm declaring n here. I'm doing this again and again. And I'm doing that while n is less than 1. 
注意，我已经将我的代码从 main 移动到了一个名为“get_positive_int”的函数中，该函数的名称描述了它的功能。我在这里声明了 n。我一直在这样做。当 n 小于 1 时，我继续这样做。

And what am I going to do up here? I can do something like this. Give me a variable called times for, how many times do you want to meow? And just call get_positive_int semicolon. 
那我在这里要做什么呢？我可以创建一个名为 times 的变量，问你想叫多少次喵？然后调用 get_positive_int 分号。

So now, again, we've abstracted things away. And just like in Scratch, our final example-- which, recall, looked a little something like this, where we just called a function to meow three times-- now we're calling a function to get text. If I hit Enter an arbitrary dramatic number of times, out of sight, out of mind, I now have two functions in this world, get_positive_int and meow that are collectively implementing this entire program. 
现在，我们又抽象了一些东西。就像在 Scratch 中的最后一个例子一样——记得，它看起来有点像这样，我们只是调用了函数来喵三次——现在我们调用了一个函数来获取文本。如果我按下 Enter 键任意多次，视而不见，我现在在这个世界上有两个函数，get_positive_int 和 meow，共同实现了整个程序。

But it's not quite correct. There's one mistake here still. Notice that get_positive_int is written slightly differently from the meow function. And just to be clear, too, let me copy its prototype to the top of the file just so we don't make that same mistake I made earlier where I didn't put the prototype at top so C didn't know what it was. What is different about these two prototypes at a glance? Yeah. 
但这并不完全正确。这里仍然有一个错误。请注意，get_positive_int 与 meow 函数的写法略有不同。为了更清楚，我还将它的原型复制到文件顶部，这样我们就不犯我之前犯过的错误了，我没有把原型放在顶部，所以 C 语言不知道它是什么。这两者的原型有什么不同之处？是的。

AUDIENCE: get_positive_int should be returning int. 
观众：get_positive_int 应该返回 int 类型。

DAVID J. MALAN: OK, so get_positive_int apparently-- and we've not talked much about this-- apparently does have an output of type integer. It's supposed to return an int, hand me back an int. It doesn't have any input. 
大卫·J·马兰：好的，所以 get_positive_int 似乎——我们还没有太多讨论这个——get_positive_int 似乎有一个整型的输出。它应该返回一个 int，还给我一个 int。它没有输入。

That's what the "void" in parentheses meant. No input, but yes output. And meow, funny enough, is the opposite-- yes input, no output. Why? Because it has a side effect, the visual thing, where it prints something to the screen but doesn't hand me any useful value back like the ask function or the ask puzzle piece did. 
这就是括号里的 "void" 的意思。没有输入，但有输出。而 meow，有趣的是，正好相反——有输入，没有输出。为什么？因为它有一个副作用，就是视觉上的，它在屏幕上打印了一些东西，但没有像 ask 函数或 ask 拼图块那样还给我任何有用的值。

So these are opposite in functionality, which means I actually need to return an integer from this function to whatever function wants to use it. So if I want the assignment operator to work here on line 9, I need to do what, all this time, get_int, get_string, and other CS50 functions have been doing. I need to, in my own function, return that value literally with a new keyword called return. 
所以这些在功能上是相反的，这意味着我实际上需要从这个函数返回一个整数给任何想要使用它的函数。所以如果我想在 9 行上使用赋值运算符，我需要做什么，一直以来，get_int、get_string 和其他 CS50 函数都在做这个。我需要在自己的函数中，用一个新的关键字“return”来返回那个值。

And this is why I keep sticking out my hand. When you want a function to hand you back a value, you literally use "return" and then that value. That's why we have "return" value as a term of art, literally the "return" keyword. So if I open my terminal window now, make cat, Enter-- huh, I did screw up accidentally. How? Yeah. 
正因如此，我才会一直伸出我的手。当你想让一个函数返回一个值给你时，你实际上会使用“return”然后是那个值。这就是为什么我们用“return” value 作为一个术语，字面意义上的“return”关键字。所以如果我现在打开我的终端窗口，输入 cat，Enter-- 哎，我无意中犯了一个错误。怎么犯的呢？是的。

AUDIENCE: [INAUDIBLE]   观众：[听不清]

DAVID J. MALAN: Yeah, so on lines 9 and 10, I made a quick change. I changed my variable to times. But I stupidly didn't change this. So that's fine. That's why n was undeclared in that context. Let me clear my terminal, make cat once more. OK, that worked. "./cat." Let's type in 5. And it's still working. 
大卫·J·马尔兰：是的，所以在 9 行和 10 行，我做了快速修改。我把我的变量改成了 times。但我愚蠢地没有改这个。所以没关系。这就是为什么在那个上下文中 n 未声明。让我清空我的终端，再次 make cat。好的，这次成功了。“./cat。”让我们输入 5。它仍然在正常工作。

So again, even though the code feels like it's-- sorry-- even though the code is growing and growing and growing, it's the exact same program we wrote super simply before break. But now we're sort of modularizing it. We're creating reusable functions. 
所以，尽管代码不断增长，但它仍然是我们在假期前写的超级简单的程序。但现在我们正在将其模块化。我们正在创建可重用的函数。

And this is why functions like get_string exists, get_int exists. Like, CS50 wrote those years ago. And we realized, why are we copying and pasting these functions in all of these different CS50 programs? Let's factor out that functionality into a function of our own-- get_int, get_string. 
这就是为什么存在像 get_string 这样的函数，get_int 这样的函数。就像 CS50 多年前写的。我们意识到，为什么我们要在所有这些不同的 CS50 程序中复制粘贴这些函数呢？让我们将这个功能提取成我们自己的函数——get_int、get_string。

Just like here, I'm proposing to factor out this functionality, get a positive integer that gives you even more precise functionality so theoretically you could use and reuse it in other programs too. By not even just putting it here, we could go put it in a file of your own name and include it in future programs as well. 
就像这里，我建议提取这个功能，获取一个正整数，它为你提供了更精确的功能，理论上你可以在其他程序中使用和重用它。不仅把它放在这里，我们还可以把它放在你自己的文件中，并在未来的程序中包含它。

That's all a library is. Someone realized, jeez, other people, including myself, might find this function useful again and again. Let's package it up in our own custom functions, just like our custom meow puzzle piece last week, so we can indeed use it again and again. 
这就是库的本质。有人意识到，哎呀，包括我自己在内，其他人可能会反复使用这个函数。让我们把它打包成我们自己的自定义函数，就像上周我们的自定义 meow 拼图一样，这样我们就可以反复使用它了。

And the takeaways for now is that unlike Scratch, which was a little more user friendly, in C, you have to specify if you want your functions to have inputs. And you must specify if you want them to have outputs as well. But more on that syntax to come. 
现在的收获是，与 Scratch 相比，Scratch 更易于使用，而在 C 语言中，你必须指定你的函数是否需要输入。你还必须指定它们是否需要输出。但关于这个语法的更多内容将在后面介绍。

So where does that bring us? So after all this discussion of code, at the end of the day, this is what's important in the world of programming. Not surprisingly, it's like, what's important when it comes to grading and evaluating the quality of code? 
那么，这又把我们带到了哪里？经过所有这些关于代码的讨论，最终，在编程的世界里，这是最重要的。不出所料，当谈到评估代码质量时，最重要的是什么？

One, and first and foremost, is correctness. If the code does not do what it's supposed to do, what was the point of writing the code? So correctness sort of goes without saying. 
首先，最重要的是正确性。如果代码没有完成它应该做的事情，写代码的意义又在哪里呢？所以正确性似乎是理所当然的。

Design, again, is much more qualitative. It's like getting feedback, again, on an English essay, where reasonable people might disagree. You can make your argument better. You can structure the paper better. You can structure the code better in the case of programming. 
设计，再次强调，更多的是定性的。这就像再次对一篇英语论文进行反馈，合理的人可能会有不同的看法。你可以让你的论点更好。你可以更好地组织论文。在编程的情况下，你可以更好地组织代码。

And style is purely aesthetic. Does it look good? Is it pretty printed, so to speak? Can other people, colleagues future and classmates present, actually read and understand it? That's what we mean by style. 
风格纯粹是美学上的。它看起来好吗？是否美观打印，换句话说？其他人们、同事、未来的同学现在是否真的能阅读并理解它？这就是我们所说的风格。

Nicely enough, within CS50's programming environment, you will have tools to evaluate the quality of all three of these axes, so to speak. So in problem set 1 onward, you'll be introduced to a command line tool that you type its name at the prompt called check50 that will check for you the correctness of your code-- not necessarily exhaustively. There might be mistakes you've made that we don't catch, which doesn't make your code correct. But it is a tool for finding many of the mistakes in your code. 
足够好，在 CS50 的编程环境中，你将拥有评估这三个轴心质量的工具，换句话说。所以从问题集 1 开始，你会接触到一种命令行工具，你可以在提示符下输入它的名字，叫做 check50，它会为你检查代码的正确性——不一定全面。你可能犯了一些我们没有捕捉到的错误，这并不意味着你的代码是正确的。但它是用来找出代码中许多错误的一个工具。

In the real world, you would have colleagues or yourself, would write tests for code you wrote or someone else wrote. So testing code is not just a grading thing. It is a real-world thing to ensure that systems are designed correctly. 
在现实世界中，你会让同事或你自己为所写的代码或他人所写的代码编写测试。所以测试代码不仅仅是评分的事情，确保系统设计正确是一个现实世界的事情。

We saw the style50 tool in VS Code already. You click the "style50" button. There is now, thanks to the Duck, a "design50" button too, also in that top right-hand corner, whereby once your code is correct and working, like several of my programs have been, you can click "design50," and the Duck will not just quack but give you qualitative advice, if it can, on how you can make that code even better even before you submit. 
我们已经在 VS Code 中看到了 style50 工具。您点击“style50”按钮。多亏了 Duck，现在还有一个“design50”按钮，也在右上角，一旦您的代码正确无误并且可以运行，就像我的许多程序一样，您就可以点击“design50”，Duck 不仅会嘎嘎叫，如果可能的话，还会给您提供关于如何使代码更好的定性建议，在您提交之前。

And of course, there's all of us humans in the room and online that you can ask these same questions of as well. So let's now solve some real-world but still simple problems as opposed to emphasizing small bite-size as we have thus far. 
当然，房间里和在线上还有我们所有人，您也可以向他们提出相同的问题。那么，我们现在来解决一些真实世界但仍然简单的问题，而不是像迄今为止那样强调小而精的问题。

So the first of these programs falls into this category of having side effects. So let's implement one or more functions that takes an argument's inputs and, as its output, produces these visual side effects. We'll draw inspiration from Super Mario Brothers-- not surprisingly, perhaps, here-- the original one, which was very two-dimensional, side-scroller, left to right. Mario or Luigi move from left to right and generally have to jump over things like pyramids or other shapes on the screen. 
因此，这些程序中的第一个属于具有副作用这一类别。让我们实现一个或多个函数，它接受参数输入，并以视觉副作用作为输出。我们将从超级马里奥兄弟中汲取灵感——也许并不令人惊讶——原始的那一个，它非常二维，是左右滚动游戏。马里奥或路易吉从左到右移动，通常需要跳过屏幕上的金字塔或其他形状。

So how might we go about implementing some of the screens from Super Mario Brothers, albeit textually? Well, we'll make it a little black and white and ASCII art, so to speak, here using just our keyboard. But suppose we want to write a program called mario.c that just prints out four question marks. It's not going to be nearly as pretty as what's on the screen here. But the logic is going to be the exact same as what Nintendo presumably did years ago. 
那么，我们如何实现一些《超级马里奥兄弟》中的屏幕，尽管是文本形式呢？嗯，我们可以把它做成黑白风格和 ASCII 艺术，用我们的键盘来说。但是，如果我们想写一个名为 mario.c 的程序，只打印四个问号。它不会像这里的屏幕那么漂亮。但逻辑将与任天堂多年前可能使用的逻辑完全相同。

So let me open VS Code, my terminal window. Let's code a program called mario.c. In mario.c, I'm going to start with some boilerplate-- I know I want to print. So even if I don't know how to do this yet, I'm going to include standard io.h. 
让我打开 VS Code，我的终端窗口。让我们编写一个名为 mario.c 的程序。在 mario.c 中，我会从一些样板代码开始——我知道我想要打印。所以即使我还不知道如何做，我也会包含标准 io.h。

For today's purposes, I'm going to copy/paste or type out that same line again and again-- int meow(void). And inside of my main function, akin to the green flag being clicked, I want to go ahead and print out four question marks. 
为了今天的演示，我会重复粘贴或输入相同的行——int meow(void)。然后在 main 函数中，就像点击绿色标志一样，我想打印出四个问号。

Well, honestly, the simplest way I can think of doing this is with printf question mark, question mark, question mark, question mark. Maybe a backslash n to move the cursor, and that's it. So that is arguably correct. 
嗯，老实说，我能想到的最简单的方法就是使用 printf 打印问号，问号，问号，问号。也许加上一个换行符\n 来移动光标，就这样。所以这可以说是正确的。

So let's do make mario in the terminal, "./mario." And it's not quite as pretty as the game version of it. But it is, in fact, the exact same idea. But here, sort of an opportunity, a stepping stone to do better design. This game changes over time. And not all of the screens have just four question marks. It might be five, six, or even more. 
那么，让我们在终端中制作马里奥，"./mario."。它并不像游戏版本那样漂亮。但实际上，它是一个完全相同的概念。但是，这里有一个机会，一个迈向更好设计的垫脚石。这个游戏会随着时间的推移而变化。并不是所有的屏幕都只有四个问号。可能有五个、六个，甚至更多。

So what's the right programming construct with which we could generalize how many question marks are printing here? What feature of C do we want? A loop, like a for loop, a while loop, or something like that. And there's different ways to do this. 
那么，我们应该使用哪种正确的编程结构来泛化这里打印多少个问号呢？我们想要 C 语言中的哪个特性？一个循环，比如 for 循环、while 循环，或者类似的东西。这里有不同的方法来做这件事。

But honestly, I've proposed earlier that we get into the habit of reaching for for loops as just very conventional. So let's do that. for int i equals 0; i less than 4-- because that's how many I want for the moment-- i++. 
但说实话，我之前建议我们养成使用 for 循环作为非常常规的习惯。那么，我们就这么做吧。for int i equals 0; i less than 4-- 因为这是我目前想要的数量-- i++;

And then inside of my curly braces there, let's go ahead and print out, quote, unquote, a single question mark, but no new line. Let me now go ahead and make mario. And can you anticipate an arguably aesthetic bug when I hit Enter? 
然后在里面的花括号里，我们不妨打印出一个“问号”，但不要换行。现在，让我去制作马里奥。当你按下 Enter 键时，你能预见到一个可能的美学上的 bug 吗？

It's not going to move the cursor to the next line. But the solution here is a little non-obvious. I don't think this helps me. If I put the backslash n there and I do make mario again and "./mario," what is this output going to look like instead? 
它不会将光标移动到下一行。但这里的解决方案有点不明显。我认为这对我没有帮助。如果我在这里放一个反斜杠 n，然后再次运行 mario 和 "./mario"，这个输出会是什么样子呢？

AUDIENCE: [INAUDIBLE]   观众：[听不清]

DAVID J. MALAN: Yeah, like a vertical column of question marks, which, while nice enough, is not the goal at hand. The goal is these horizontal ones. So someone else, what's the fix here, if clearly putting the backslash n inside of line 7 is wrong? 
大卫·J·马尔安：是的，就像一列垂直的问号，虽然不错，但不是我们的目标。我们的目标是这些水平的。那么，如果显然在第七行放反斜杠 n 是错误的，这里的解决方案是什么？

AUDIENCE: [INAUDIBLE]   观众：[听不清]

DAVID J. MALAN: Yeah, so put it after the loop, and not after the printf line, specifically after and thus outside of the loop so that after that loop is finished executing three total times, it's totally fine to just print nothing other than a backslash n so long as we now recompile the code, make mario, "./mario." And, voila, now we have four in a row. It's a little generalized. 
大卫·J·马尔安：是的，所以把它放在循环之后，而不是放在 printf 行之后，具体来说，是在循环之外，这样在循环执行了三次之后，就可以只打印一个反斜杠 n，只要我们现在重新编译代码，运行 mario，"./mario"。哇，现在我们有一排四个了。这有点过于笼统了。

OK, so we've sort of plucked off a fairly easy problem. Well, let's go back to the world of Mario and try something that is, in fact, vertical, like this. So this is another scene with three bricks here. Instead of using question marks, we'll use hash symbols to represent bricks. This actually is the incarnation of my mistake a moment ago. 
好吧，我们差不多解决了一个相当简单的问题。嗯，让我们回到马里奥的世界，尝试一些真正垂直的东西，就像这样。所以这是一个有三个砖块的场景。我们不用问号，而是用井号来表示砖块。这实际上是我刚才犯的一个错误的体现。

So let me undo this by getting rid of that printf. Let me change the inside one from a question mark to a hash symbol, which looks the most similar in ASCII to a brick. And let's go ahead and put a backslash n after that. 
让我撤销这个操作，去掉那个 printf。让我把里面的问号改成井号，它在 ASCII 码中看起来最像砖块。然后我们再放一个回车换行符。

If I do go ahead and do make mario, "./mario", it's not that interesting. But-- and it's actually not that correct because I wanted three. So no big deal. I can, of course, go back to my code and change the 4 to a 3. Or better yet, I could use get_int or my new get_positive_int function and just generalize this further so that I can print out any number of them. But for now "./mario" gives me three. 
如果我继续执行 make mario "./mario"，它并不那么有趣。但实际上并不正确，因为我想要三个。所以没什么大不了的。我当然可以回到我的代码里，把 4 改成 3。或者更好，我可以使用 get_int 或者我新写的 get_positive_int 函数，这样就可以更通用地打印出任意数量的它们。但现在"./mario"给我三个。

All right, so we've plucked off the second of two problems. Let's now let things escalate a bit. So it turns out, once you get to World 2 and beyond, there are some underground parts of Mario where you actually have bigger, more solid bricks like these here. And just by eyeballing it, this is a 3-by-3 grid of bricks, like nine of them total, we'll conjecture. 
好吧，所以我们已经解决了两个问题中的第二个。现在让我们让事情升级一下。结果是，一旦你进入世界 2 及其以上，马里奥的地下部分实际上有一些更大、更坚固的砖块，就像这里这些。仅凭肉眼观察，这是一个 3x3 的砖块网格，总共九块，我们这样推测。

So how can I go about implementing this? Well, now is where the program gets a little more interesting. And the not-- well, the poorly designed way to do this would be like printf hash, hash, hash, backslash n, semicolon, and then maybe printf, printf. That's correct but not well designed. 
那我该如何实现这个功能呢？嗯，现在程序变得更有趣了。嗯，不是——设计得不好的方法可能是像 printf hash, hash, hash, backslash n, semicolon，然后可能是 printf, printf。这是正确的，但不是很好的设计。

So make mario, "./mario." It doesn't look like a square, just because these hashes are more vertical than they are horizontal. But it is correct, this example. But it's not very generalizable. And this is literally hard coding. I copy/pasted. I'm just doing a lot of bad practices here. 
所以创建一个名为“./mario.”的马里奥。它看起来并不像正方形，只是因为这些 hash 更垂直而不是水平。但这个例子是对的。但这并不太通用。这实际上是硬编码。我只是复制粘贴。我做了很多不好的实践。

So what could I do instead? Well, it turns out we can combine today's ideas, including loops, to do things again and again. So what is this grid of bricks? It's a 3-by-3. So it's like a row and a row and a row. And then within each row, there's column, column, column. So it, too, is like an old-timey typewriter that prints one line, then the next line, then the next line, and so forth. 
那么，我该做什么呢？嗯，结果是我们可以将今天的想法结合起来，包括循环，重复做事情。那么这个砖块网格是什么？它是一个 3 乘 3 的。所以它就像一行又一行。然后在每一行中，有列，列，列。所以它也像一台老式的打字机，打印一行，然后下一行，然后下一行，以此类推。

So how can we conjure that in code? Well, let me go ahead and do this. I think a print approach would work like this. For int i equals 0, i less than 3, i plus plus, because I know I want to do something three times-- but what do I want to do three times? 
我们如何在代码中实现这个？嗯，让我先做这个。我认为打印方法会是这样。对于 int i 等于 0，i 小于 3，i 加加，因为我知道我想做三次——但我想做什么三次？

This loop kind of represents, in my mind's eye, row, row, row. So in fact, I could be more pedantic. If I want my i to mean something beyond int, I could say row equals 0, row less than 3, row plus plus, just to help me think about it. 
这个循环在我的脑海中代表了一行又一行的行。事实上，如果我想让 i 的意义超越 int，我可以说 row 等于 0，row 小于 3，row 加加，这样可以帮助我思考。

And then what do I want to do on each row? What do I want to print? Column, column, column, so brick, brick, brick. So how do I print three bricks or any number of bricks? 
那么，我在每一行想做什么？我想打印什么？列，列，列，所以砖块，砖块，砖块。那么我如何打印三个砖块或任何数量的砖块？

Well, I could cheat and just do printf hash, hash, hash, backslash n. But again, I can't generalize. I can't take an input from the user and print four or five or six bricks. So that's going to get me into trouble eventually. So maybe I could use a loop. 
嗯，我可以作弊，直接使用 printf hash, hash, hash, backslash n。但再次，我不能泛化。我不能从用户那里获取输入并打印四到五到六个砖块。这最终会让我陷入麻烦。所以也许我可以使用循环。

So I could do for int i equals 0, i less than 3, i plus plus inside of my loop. And then in here, I could print out one hash. And that's kind of on the right direction, the right path, because now I'm just using the simple building block, or brick, but reusing it again and again. And it's totally fine to have nested these columns in this way. 
所以我可以这样做：for int i equals 0, i less than 3, i plus plus inside of my loop。然后在这里，我可以打印出一个 hash。这有点儿在正确的方向上，正确的路径，因为现在我只是使用简单的构建块，或者砖块，但反复使用它。以这种方式嵌套列是完全正常的。

I used i out of habit. But what would a better name be? Well, maybe "column," or maybe just C-O-L, "col" for short, so that my code is saying what it does for me. And I don't have to use "row" or "column" explicitly. I don't need to print them. But I am using them as counters one after the other. 
我出于习惯使用了 i。但更好的名字会是什么？嗯，也许“列”，或者也许只是 C-O-L，“col”简称，这样我的代码就会告诉我它做了什么。我不需要明确使用“行”或“列”。我不需要打印它们。但我确实将它们用作一个接一个的计数器。

So let me go ahead and run make Mario, "./mario." And I'm feeling good about this, but-- ugh. Damn it, there's nine bricks. But they're not really laid out. Why? What's the fix? Yeah. 
让我先运行 make Mario，"./mario。" 我对此感觉良好，但——呃。该死，有九个砖块。但它们并没有真正铺开。为什么？解决办法是什么？是的。

AUDIENCE: You never went to a new line. 
观众：你从未换行。

DAVID J. MALAN: Yeah, I never went to a new line. And let me do what I think you're not going to suggest I do. Let me just go to the obvious place. All right, well, let's put one right after the brick. But, of course, if I do make mario, "./mario," I'm making the same mistake as before. I'm printing out too many new lines. So in between what lines do I actually want to print a new line? Between, yeah? 
大卫·J·马兰：是的，我从未换行。让我做你认为我不会建议我做的事情。让我直接去明显的地方。好吧，那么，就在砖块后面放一个。但是，当然，如果我创建 mario，"./mario"，我就犯了和之前一样的错误。我打印了太多的新行。那么，我实际上想在哪些行之间打印新行？在之间，对吗？

AUDIENCE: 10 and 11. 
观众：第 10 行和第 11 行。

DAVID J. MALAN: Yeah, so 10 and 11. So outside of the inner loop but inside of the outer loop so it happens again and again. So let's just print out, as before, a single backslash n, semicolon. Now let's do make mario, "./mario," Enter. Ah, now it's generalized as I see fit. 
大卫·J·马兰：是的，所以第 10 行和第 11 行。所以在内循环之外，在外循环之内，这样就会反复发生。那么，就像之前一样，只打印一个单斜杠 n，分号。现在让我们做 make mario，"./mario"，回车。啊，现在它已经按照我的想法通用化了。

And if I really wanted to dwell on this, I could go in and I could prompt the user with get_int or with get_positive_int, figure out what row and/or column should be. We can make any size brick that we want. But now we have a nice starting point. 
如果我真的想深入探讨这个问题，我可以进入并使用 get_int 或 get_positive_int 提示用户，找出应该是什么行和/或列。我们可以制作任何大小的砖块。但现在我们有一个很好的起点。

But there's another way to think about this because I dare say, especially for your first CS50 problem set, if you're trying to print bricks and the world of Mario in this way, it's probably not going to be obvious to come up with loops like this and just magically get it working after 45 seconds in total. It'll be a struggle at first. But there are some patterns to follow. 
但是，还有另一种思考方式，因为我敢说，尤其是对于你的第一个 CS50 问题集，如果你试图以这种方式打印砖块和马里奥的世界，可能不会很明显地想出这样的循环，并且只需要 45 秒就能神奇地让它工作。一开始可能会很吃力。但有一些模式可以遵循。

So one, it's pretty conventional nonetheless to use just i and then j and then k and then l. And if you've got nested, nested, nested, nested for loops, at some point nesting, you're probably writing bad code. It's not well designed. But one or two or maybe three nestings could be an OK thing. 
所以，第一点，尽管如此，使用 i、j、k、l 这样的变量是很常见的。如果你有嵌套的嵌套的嵌套的嵌套循环，在某个时候，嵌套太多，你很可能在写糟糕的代码。这不是一个好的设计。但一两个或可能三个嵌套可能还是可以接受的。

But you cannot use and reuse i again and again. Why? Because if you're counting i here, but then you're changing i here to do your columns left to right, you're going to get all of your math out of sync. So you need two separate variables. i and j are conventional. Or row and column would work too. 
但是你不能一次又一次地重复使用 i。为什么？因为如果你在这里计数 i，然后又在这里将 i 改为从左到右进行列操作，你的数学就会变得不一致。所以你需要两个独立的变量。i 和 j 是传统的。或者行和列也可以。

But if we go back to this idea of rows and columns, well, let me actually factor something out here. And this might help you instead. Suppose that you set out on this problem. You know you want to do something three times. But you don't quite understand how to print those rows. 
但是如果我们回到行和列的这个想法，好吧，让我实际上提取一下这里的东西。这可能会帮到你。假设你开始解决这个问题。你知道你想要做三次。但你并不完全理解如何打印这些行。

Well, take a baby step, a bite out of the problem, and maybe do this. Create a function with no output, just a side effect whose purpose in life is to print a row. And how many rows? Well, maybe n for some number of rows-- for some number of bricks, rather. 
好吧，先从小步开始，咬一口问题，也许这样做。创建一个没有输出，只有副作用的功能，其目的就是打印一行。那么有多少行呢？也许 n 代表一些行数——或者说是砖块的数量。

How do you print a row of bricks? Well, let me just think about this in isolation. How do I print a single row of bricks? That's easy-- for int i equals 0, i is less than n-- if I'm generalizing-- i++, and then-- whoops, i++. 
你怎么打印一排砖块？好吧，让我单独考虑这个问题。我如何打印一排砖块？这很简单——for int i = 0, i < n——如果我是泛化的——i++，然后——哎呀，i++。

And then, inside of my curly braces, go ahead and just print out a single hash. And at the end, as you suggested, print out a single new line. In other words, abstract away the idea of printing a single row. 
然后，在我的花括号内部，就先打印出一个单行哈希。最后，就像你建议的那样，打印出一个单行换行符。换句话说，抽象出打印单行的概念。

And in fact, at this point in the story, especially if you're struggling to get started, you don't even need to start with main. Take a bite out of the problem that makes sense to you that's smaller than the whole problem, printing a single row because then you can come in and iterate. Then you can go in and say, OK, now let's write my actual main function. 
事实上，在这个故事情节中，尤其是如果你在努力开始，你甚至不需要从 main 开始。先从那个比整个问题更小、对你有意义的部分问题开始，比如打印单行，因为这样你可以逐步迭代。然后你可以进入并说，好的，现在让我们编写实际的 main 函数。

So int meow(void), as always. And now what do I want to do? I want to print out a whole bunch of rows. How do I print out a whole bunch of rows? Oh, my god, it's like the same idea-- for int i equals 0, i is less than, let's call it 3 for now-- but we can generalize that-- i++. 
所以 int meow(void)，一如既往。现在我想要做什么？我想打印出很多行。我如何打印出很多行？哦，我的天，这就像同一个想法-- for int i equals 0, i 小于，我们先叫它 3 吧--但我们可以将其推广--i++。

And what do I want to do on each iteration of this loop? My gosh, just print row with three bricks. And then we're sort of done. Again, out of sight, out of mind, this function can go away and never be seen before because once print_row exists, that's what it in fact does for me. 
在这个循环的每次迭代中，我想要做什么？我的天，只是打印带有三个砖块的一行。然后我们就完成了。再次，眼不见为净，这个函数可以消失，永远不再出现，因为一旦 print_row 存在，它实际上就为我做了这件事。

Now, this isn't 100% correct. I still need my prototype because if I've made my own function, I need to tell C in advance that it shall exist. So I need to copy and paste that one line of code. If I were really being pedantic, this is bad design. 
现在，这并不完全正确。我仍然需要我的原型，因为如果我编写了自己的函数，我需要提前告诉 C 语言它将存在。所以我需要复制粘贴那一行代码。如果我真的非常挑剔，这算不上是好的设计。

In general, when you have the same number in multiple places in a program, a programmer would call this a "magic number." Like, how is that working? Just honor system, that you're using the same number again and again. 
通常情况下，当你在程序中的多个地方使用相同的数字时，程序员会称其为“魔法数字”。比如，它是怎么工作的？只是靠约定，你反复使用相同的数字。

So a better solution here, even if you're not going to take user input, would be to do this-- int n equals 3. And then use n here. And then use n here. Or you could call it anything you want. But now you've specified 3 in one and only one place. 
所以，即使你不会接受用户输入，这里的一个更好的解决方案就是这样做-- int n 等于 3。然后在这里使用 n。然后在这里使用 n。或者你可以给它取任何你想要的名称。但现在你只在唯一的一个地方指定了 3。

And we can go one step further. It turns out, in C and in other languages, you can protect yourself against yourself. If you know that a variable should never change its value, it should always stay 3 in this case, you can use what's called a constant, where you can specifically say, I don't want just n to be an int. I want it to be a const int, "const" for short for "constant." 
我们可以更进一步。实际上，在 C 语言和其他语言中，你可以保护自己免受自己伤害。如果你知道一个变量的值不应该改变，它应该始终保持 3（在这个例子中），你可以使用所谓的“常量”，你可以特别说明，我不想 n 只是一个 int，我想它是一个 const int，“const”是“常量”的缩写。

And this means even if I try to change n in my code, the compiler will not let me. So I can protect myself from myself, or in the real world, you can use a variable that none of your colleagues can foolishly change on you without you realizing that it has happened. 
即使我在代码中尝试更改 n，编译器也不会让我这么做。这样我就可以保护自己，或者在现实世界中，你可以使用一个你的同事无法愚蠢地更改的变量，而你却不知道它已经发生了。

So a lot of programming, honestly, is just not trusting yourself the next morning when you've forgotten what code you wrote, let alone the next month, the next year when you're writing code in the real world. So constants just give us a feature to defend against ourselves. 
所以，坦白说，很多编程其实只是不相信第二天早上你会忘记你写了什么代码，更不用说下个月，下一年你在现实世界中编写代码了。所以常量只是给我们提供了一个防御自己的特性。

There's another feature that's useful too, especially when you wake up the next day and you're like, oh, my god, how does this code work? What does it do? Well, there's comments in code. And some of you might have used this in Scratch. You could add little yellow sticky notes in Scratch for "comments." 
另一个有用的特性也是一样，尤其是当你第二天醒来，你可能会想，哦，我的天哪，这段代码是怎么工作的？它是做什么的？嗯，代码中有注释。你们中的一些人可能已经在 Scratch 中使用过这个功能了。你可以在 Scratch 中添加黄色的便签作为“注释”。

In code, you can do something like this. You can, if you want to put an English reminder to yourself, or if you speak some other human language-- a comment in Spanish or any other human language-- you can write it with a slash slash at the start of the line. And then you can say something like, print n rows. 
在代码中，你可以这样做。如果你想给自己一个英文的提醒，或者如果你说其他的人类语言——西班牙语或其他任何人类语言——你可以在行的开头写上斜杠斜杠，然后你可以写一些像“打印 n 行”这样的内容。

And then this tells you, in a comment, what those subsequent lines of code are doing. It's sort of a note-to-self. It has no functionality for the computer's sake. It just is a note to yourself. Or you can say something like this, like never change n, because you're making clear that it's indeed constant. But that, too, is a little pedantic since const says the same. 
然后这个注释会告诉你，这些后续的代码行在做什么。这就像是一个自我笔记。它对计算机没有功能，只是给你自己做一个笔记。或者说，比如永远不要改变 n，因为这表明它确实是一个常量。但是，这也有些过于繁琐，因为 const 已经表达了同样的意思。

But comments are notes to self to help you remember what something is doing or why you did it this way. Questions now on any of these Mario problems that we have solved? No? 
但是注释是自我笔记，帮助你记住某个东西在做什么或者为什么这样做。对于这些我们解决的 Mario 问题有任何疑问吗？没有？

All right, so one final set of examples that push the limit of what computers can actually do. Thus far, we've solved every problem I've proposed. But that's because I've kind of been skirting some of the underlying challenges. 
好吧，所以有一组最后的例子，这些例子将计算机实际上能做什么的极限推向了极限。到目前为止，我们解决了你提出的每一个问题。但是，那是因为我一直在回避一些潜在挑战。

So it turns out that we have not only functions that give us side effects visually on the screen. We again have functions that have return values. So let's focus on those and where things can go wrong. And let's use a bunch of other operators as well. 
结果我们发现，我们不仅有在屏幕上产生视觉副作用的功能。我们还有具有返回值的功能。让我们专注于这些，以及可能会出错的地方。同时，我们也会使用一些其他的操作符。

Suffice it to say, computers got their start by being really good calculators. So computers support addition, subtraction, multiplication, division, remainder operators, represented by the percent sign here, which says take the remainder of something over something else. And there's even more operators than this. 
suffice it to say，计算机之所以能够起步，是因为它们非常擅长计算。因此，计算机支持加法、减法、乘法、除法、取余运算符，这里用百分号表示，表示取某物除以另一物的余数。而且还有比这更多的运算符。

So let's go ahead and implement our own calculator of sorts that actually has some bugs along the way. Let me go back over to VS Code here. I'll close mario.c, open my terminal, and code up one final file called calculator.c. 
让我们开始实现一个带有一些错误的计算器。让我回到 VS Code 这里。我会关闭 mario.c，打开我的终端，并编写一个名为 calculator.c 的最后一个文件。

And in this calculator file, let's go ahead and do something super simple initially. Let's go ahead and include CS50.h. Let's include standard io.h. Let's do int meow(void), as always-- all boilerplate thus far. 
在这个计算器文件中，让我们一开始先做一些非常简单的事情。让我们先包含 CS50.h。让我们包含标准 io.h。让我们编写 int meow(void)，就像往常一样--到目前为止都是一些样板代码。

And now let's do something more interesting-- int x equals get_int. And we'll prompt the user for an x value. int y-- prompt the user for a y value, as we've done previously for comparing numbers. And let's just do something super simple. Let's give myself another variable, int z equals x plus y. And then let's print out the sum. 
现在我们来做一些更有趣的事情-- int x = get_int。我们将提示用户输入 x 的值。int y-- 提示用户输入 y 的值，就像我们之前比较数字时做的那样。让我们做一些非常简单的事情。让我再给自己一个变量，int z = x + y。然后让我们打印出总和。

So printf, quote, unquote-- and I don't percent s here. If I want to print out a number-- someone said it earlier-- we want percent s for string but percent i for integer. Backslash n, and print out the value of z. 
所以 printf，引号，引号-- 我这里没有使用%s。如果我想打印出一个数字-- 之前有人提到过-- 我们想用%s 来打印字符串，但用%i 来打印整数。反斜杠 n，并打印出 z 的值。

So it's a little silly, this calculator. It just adds two numbers together. But it's going to demonstrate some points. So make calculator, Enter. So far, so good-- "./calculator." Let's just say x is 1, y is 2, z is going to be 3. 
所以这个计算器有点傻，它只是把两个数字加在一起。但它将要演示一些要点。所以创建计算器，输入。到目前为止，一切顺利-- "./calculator。" 假设 x 是 1，y 是 2，z 将是 3。

This code is correct, simple though it is. Is there an opportunity for marginally better design? Could we tighten this up, make it shorter? Fewer lines means lower probability of bugs, probably. Yeah. 
这段代码是正确的，虽然很简单。有没有机会进行稍微更好的设计？我们能把它简化，让它更短一些？更少的行意味着更低的错误概率，可能吧。

AUDIENCE: You don't need to provide a separate variable z. 
观众：无需提供单独的变量 z。

DAVID J. MALAN: Yeah, we don't really need a separate variable z. I mean, it's fine if it's clearer to you, if it's clearer to your TF, if it's clearer to your colleagues. But honestly, this is so relatively simple, I think we just get rid of z and just say something like x plus y here, which is totally reasonable as well. 
大卫·J·马尔兰：是的，我们其实不需要一个单独的变量 z。我的意思是，如果你觉得这样更清晰，如果你的 TF 觉得这样更清晰，如果你的同事觉得这样更清晰，那也行。但说实话，这真的很简单，我觉得我们直接去掉 z，在这里说像 x 加 y 这样的东西，也是完全合理的。

But you don't want to take this to an extreme. Heck, if we don't need z, do we really need x and y? Well, we could do something like this. Let me actually-- whoops-- let me actually delete these lines of code and claim-- we can do this all in one very pretty one-liner. We could do, say, get_int x plus get_int y. 
但是你不想把它推向极端。哎呀，如果我们不需要 z，那么我们真的需要 x 和 y 吗？嗯，我们可以这样做。让我实际上——哎呀——让我实际上删除这些代码行并声称——我们可以用一行非常漂亮的代码完成这个。我们可以这样做，比如，get_int x 加上 get_int y。

And notice now, like the join example last time, I'm calling get_int once, get_int twice. Both of them return a value, which is going to be 1 and 2 respectively based on what I typed earlier. Then I'm doing 1 plus 2. That's going into printf as the second argument. This is actually correct and will work. This is just stupid. Don't do this. 
注意现在，就像上次提到的 join 示例一样，我调用了一次 get_int，两次 get_int。它们都返回一个值，根据我之前输入的内容，分别是 1 和 2。然后我做了 1 加 2。这个结果将作为 printf 的第二个参数传入。这是正确的，并且可以工作。这真是太愚蠢了。不要这样做。

We've crossed some ill-defined line where this is just harder now to read. And so even though the variables aren't strictly necessary, I would argue, and I think most programmers would argue, this is just much more readable. Each line is doing a little bit less work. There's less chance for error. It just makes a little more sense. 
我们已经越过了一条定义不明确的界限，现在这变得更难阅读了。尽管变量在严格意义上不是必需的，我认为，大多数程序员也会认为，这样更易于阅读。每一行都做一点更少的工作。错误的机会更少。这使它更有意义。

But reasonable people will disagree. So therefore, this is to say, over time, too, you and your TF might disagree. You and your colleagues might disagree. And at that point is when the religious debates kick in as to which way is the right way. 
但是合理的人可能会不同意。所以，这也意味着，随着时间的推移，你和你的 TF 可能会不同意。你和你的同事可能会不同意。到了那个时候，宗教辩论就会介入，争论哪条路才是正确的。

All right, so that's one calculator. Let's do something else that maybe just doubles a number here. So let me change this to just get one integer from the user. Let's just call it x. And let's just double it quite simply. 
好的，这是一个计算器。让我们来做点别的，比如只是将一个数字翻倍。让我改变一下，只从用户那里获取一个整数。让我们称它为 x。然后简单地将它翻倍。

So printf, percent i, backslash n, x times 2. We'll quite simply double it. The star operator is indeed multiplication in this case. So that's going to go ahead and double my number. 
所以 printf，百分号 i，反斜杠 n，x 乘以 2。我们简单地将它翻倍。星号运算符在这种情况下确实是乘法。所以这将翻倍我的数字。

So make calculator again, "./calculator." Enter. And let's go ahead and type in 1. And I get back 2. Let's run it again. Type in 2, I get back 4. Type it again. Let's type in 3. I get back 6, and so forth. 
所以再次运行计算器，输入"./calculator."。然后输入 1，我得到 2。再次运行。输入 2，我得到 4。再次输入。输入 3，我得到 6，以此类推。

All right, so that's not bad in this case here. But what if we actually want to write a proper program here? In fact, yeah, let's see. This is sort of a meme that comes and goes. Let me see if you recognize this. 
好的，在这种情况下这里还不错。但如果我们真的想写一个合适的程序呢？实际上，是的，让我们看看。这有点像来来去去的梗。看看你是否能认出这个。

I'm going to go ahead and say another variable-- not x. Let's be more specific, like int dollars equals 1. And then let me deliberately induce an infinite loop. Sometimes it is useful to induce an infinite loop so long as you eventually break out of it somehow if you don't want the program to run forever. 
我将接着说另一个变量——不是 x。让我们更具体一点，比如 int dollars 等于 1。然后让我故意引入一个无限循环。有时引入无限循环是有用的，只要你最终能从中退出，否则程序不会永远运行。

I'm going to ask the user a question asking them for a char c using get_char. And I'm going to ask them, quote, unquote, "Here's percent i." Period. "Double it and give it to the next person?" Question mark. This is ringing a bell. And then we can pass in to get_char the dollars value there. 
我将询问用户一个问题，要求他们使用 get_char 输入一个字符 c。我会问他们，“这是百分比 i。”句号。“把它翻倍然后传给下一个人？”问号。这让我想起了什么。然后我们可以将那里的 dollars 值传递给 get_char。

So actually, this looks a little cryptic already. I'm going to put a dollar sign in front of it as though we're actually dealing with US currency. And what do we want to do? How about if the user says y for yes-- double it and give it to the next person-- then let's go ahead and do dollars. And let's double "dollar." 
实际上，这看起来已经有点神秘了。我会在它前面加上美元符号，好像我们真的在处理美国货币。我们想做什么？如果用户说 y 表示是——翻倍然后传给下一个人——那么我们就来做 dollars。让我们来翻倍“美元”。

So I can do dollars equals dollars times 2. Or recall the trick for plus and minus. I can also do times equals 2, which just doubles it in one line as well. Just a little syntactic sugar, as programmers call it, that just tighten up your code even though it's the exact same thing. 
因此我可以这样做：美元等于美元乘以 2。或者回忆一下加减法的技巧。我还可以这样做：乘以等于 2，这样一行就能将其翻倍。这只是程序员所说的“语法糖”，虽然它和原来的完全一样，但可以使代码更加紧凑。

But what if the user does not type y and they want to keep the money? Well, we have an else condition. At that point, you don't want to keep asking, asking, asking them with get_char. Let's just break out of this loop instead. 
但是，如果用户没有输入 y，他们想要保留这笔钱怎么办？我们有一个 else 条件。到那时，你不想再通过 get_char 不断地询问他们。我们直接跳出这个循环吧。

So break is another keyword that if you're inside of a for loop, a while loop, a do-while loop, you can forcibly break out of the loop early if and when you want to. And so this satisfies the goal of making sure that this doesn't run forever, but it is going to run again and again and again while we keep prompting the user with this question. 
所以 break 是一个关键字，如果你在一个 for 循环、while 循环或 do-while 循环中，你可以在需要的时候强制提前退出循环。这样就可以确保它不会无限运行，但会不断地运行，直到我们停止提示用户这个问题。

So let's see now what happens except, at the end, let's go ahead and make sure the user knows how much money they're walking away with. Here's dollar sign, percent i, backslash n, dollars. So we will see, at the end of this, whatever dollar amount the person ends up with. 
现在我们来看看会发生什么，不过，在最后，让我们确保用户知道他们最终能带走多少钱。这里是美元符号，百分号 i，换行符，美元符号。所以，在最后，我们会看到这个人最终剩下的金额。

Make calculator, Enter. "./calculator." And let me increase my terminal window size. So here we go. "Here's $1. Double it and give it to the next person?" Yes. "Here's $2. Double it and give it to the next person?" Yes, yes, yes, yes, yes. 
制作计算器，输入。".calculator." 然后让我把终端窗口的大小增加一下。所以，我们开始吧。“这里有 1 美元。翻倍后给下一个人？”是的。“这里有 2 美元。翻倍后给下一个人？”是的，是的，是的，是的，是的。

So the Instagram Reels aren't that long. But if you keep doubling it again and again, this is called exponentiation, which will make you quite wealthy quite quickly because, notice, we're already in the thousands of dollars by just saying yes and yes and yes. 
所以 Instagram Reels 并不长。但是如果你一次又一次地翻倍，这就叫做指数增长，这会让你很快变得非常富有，因为，注意，我们只通过说“是的”和“是的”就变成了几千美元。

It's an interesting societal question as to what dollar amount you would keep the money and no longer double it and pass it on. But for now, we'll just keep doubling it because this is just getting bigger and bigger, seemingly infinitely large And the C program-- but, oh, my god, apparently the Instagram Reels cut off the meme too short because eventually it goes negative and then 0. What's actually going on here?   

The code is actually correct. But we're bumping up against a different kind of problem. Any instinct for what is actually going wrong here? It's not doubling forever. Yeah.   

AUDIENCE: There's not enough bits to store.   

DAVID J. MALAN: Yeah, there's not enough bits to store bigger and bigger numbers. Recall, with 32 bits, which happens to be how big most ints are, you can count as high as 4 billion if you start at 0 or roughly as high as 2 billion if you want to handle negative numbers as well, negative 2 billion to positive 2 billion.   

So eventually, once I get to $2 billion, or $1 billion, it goes negative. And then it just goes to 0 altogether. This is because of something called integer overflow, whereby if you only have a finite number of bits and you keep incrementing them, incrementing them, incrementing them, eventually you can't just carry the 1 because there's no 33rd bit.   

So all of the other bits wrap around from ones to zeros. And it looks like all 32 of your bits are 0 because the 33rd bit was supposed to be the 1, but it's not there. They don't have enough memory.   

So this is a fundamental problem with computers whereby if you count high enough, things will just start to break, at least if you're using C or C++ or certain other languages that don't anticipate this. And there's a very real implication of this.   

So here's a photograph of something we'll look at more in time to come of memory inside of your computer or phone or any electronic device. Suffice it to say, there's only a finite amount of memory. And if you're only using 32 bits then, or heck even three bits, you will eventually overflow. We used three bits last week.   

So here's an example. In binary, if you're only using three bits, per the white digits here-- I've put in gray the fourth just to show you what carry we might want to have-- here's 0, 1, 2, 3, 4, 5, 4, 7, just like last week. And just like last week, someone said, how do we get to 8? We need another bit.   

But if that bit is grayed out because it doesn't exist, we've just overflowed this tiny integer and gotten back to 0, just like my money went to $0 instead. So how do we actually avoid that? One way to do this is this.   

Let me hit Control-C to break out of the program. Or I could just type "no." Let me shrink my terminal window and clear it here. I could actually do this.   

It turns out that ints use 32 bits typically. But there's another data type that was on the slide before called long, which is a longer version of an int, which is 64 bits, which is crazy big. There's not that many dollars in the world. But it's still finite, even though I can't pronounce a number that big. 
实际上，整型通常使用 32 位。但之前幻灯片上提到过另一种数据类型，叫做长整型，它是整型的长版本，是 64 位，这太疯狂了。世界上没有那么多美元。但它仍然是有限的，尽管我无法说出那么大的数字。

But if we change all of our ints to longs and we change our placeholder from percent i to percent li, for long int, I can actually count higher and higher. So case in point, let me actually go back to my terminal-- make calculator, Enter. Make it larger again-- "./calculator."   

And I'm just going to keep saying yes but faster this time. The sequence is exactly the same. But recall that once we got into the billions, it started to wrap to negative and then 0. This is a lot of money now. Longs are indeed longer. And I could do this probably all day long.   

Oh, interesting. I shouldn't have said that. Can't do this all day long because eventually a long, too, will overflow. [WHISPERS] I just didn't think it was going to happen that fast. So a long, too, will overflow because we'll need a 65th bit, but the computer has not allocated it. So that, too, becomes an issue of overflow. 
哦，有趣。我不应该那么说。不可能整天都这样做，因为最终也会溢出。[低语]我只是没想到会发生得那么快。所以，也会溢出，因为我们需要第 65 位，但电脑没有分配它。所以，这也变成了溢出的问题。

To read an excerpt, these are very real world issues. And in fact, here's a photograph of a Boeing 787 years ago that actually had issues beyond the most recent issues with Boeing airplanes, whereby after 248 days, the Boeing 787, years ago, can lose all of its electrical power due to the generator control units simultaneously going into failsafe mode, whatever that means. 
阅读摘录时，这些问题都是非常真实的世界问题。事实上，这里有一张几年前波音 787 的照片，实际上它的问题超出了波音飞机最近的问题，因为在 248 天后，几年前的那架波音 787 由于发电机控制单元同时进入安全模式，无论这意味着什么，可以失去所有电力。

But if you dig into this, it turns out that there was a software counter in these airplanes years ago that would overflow after 248 days of continuous power. 248 days, why? Well, Boeing was using a 32-bit integer. And they were using it to count tenths of seconds.   

And it turns out, if you do the math, after 248 days, you have used too many tenths such that you overflow the size of a 32-bit integer. The plane would essentially have this integer, this tiny, stupid little variable, overflow. But generally speaking, when your numbers suddenly go negative or 0, bad things happen. The plane could literally lose its power mid-flight or on the ground. And if you can believe it, anyone want to guess what Boeing's workaround was till they fixed the actual software?   

AUDIENCE: [INAUDIBLE]   观众：[听不清]

What's that?   

AUDIENCE: [? It's for ?] [INAUDIBLE].   

DAVID J. MALAN: Not even-- reboot the plane. They were told, every few days, certainly every 248 days, turn the power off, turn it back on, which, stupidly, is what all of us have been told for years with our Macs and PCs and phones. Why? Because sometimes, because of bugs and software, computers get into funky states, which is a colloquial way of saying some programmer made a mistake and some counter overflowed or some condition wasn't handled and just weird, unexpected things happen.   

So rebooting just resets all of your variables back to their original values and gives you more time, more runway in this case, no pun intended. There are others. In fact, one of the most famous ones from the 1980s was the original Pac-Man game-- only had support for 255 levels. Why? They were using 8 bits. Recall that 8 bits gives you 256. But if you start counting at 0, you can only go to 255.   

So the crazy kids who were so good at Pac-Man that they got to level 256, the makers of Pac-Man did not anticipate that anyone was going to win that many levels. And just weird stuff happened on the screen. All of the fruit started overwriting everything because they didn't have enough memory allocated to the level, nor did they have a condition that says, if level equals equals 255, "you win." There was just nothing handling that corner case, so to speak.   

So these things abound even these days. Thankfully, in some languages, there are better solutions where you can use big integers. And you'll just use 64, maybe 128, maybe 256 bits. But you need to use a language or a library that allows you to grow and shrink the amount of memory being used. And many, if not most languages, do not do that for us.   

So there's a few final problems to see that we've been taking for granted thus far. And they also involve numbers and memory. So let's go back into our calculator. Let's throw away all of this meme code here. And instead, let's go ahead and do something simple again.   

int x equals get_int. And prompt the user for a variable x. int y equals get_int, prompt the user for a variable y. And this time, instead of addition, instead of doubling, let's do division. So printf, quote, unquote, percent i backslash n. And then plug in x divided by y. So you use a single forward slash for division.   

Let me go ahead and, make calculator down here, "./calculator." And let's go ahead and do 1 divided by 3, which should, in fact, be-- it's not really 0. It's like 0.333. Let's try this again. How about "./calculator" 3 divided by 2? Should be 1.5. Nope, computer thinks it's 1. Well, what's happening here?   

Well, it turns out, when you're using integers in a program, you are vulnerable to what's called truncation. An integer plus an integer gives you an integer. An integer divided by an integer, funny enough, gives you an integer.   

So even if the answer is supposed to be 0.333 or 1.5, everything in the world of integers throws away the decimal point onward. And you only get the integer part of the value. So it's not even rounding. It's truncating everything after the decimal.   

So this program is just not correct. But there are solutions potentially. For instance, if I go back into my code here and I use a different format code we haven't used yet-- we had s for string, i for int. There's also f for float. And a float was like a real number, something with a decimal point in it by definition. We just haven't used it yet.   

I could tell the computer to print this as a float. So let me do make calculator again. And now, hm, it's specifying type double. There's an error here. The problem is that I can't just tell the computer to format this number as a float. I need to convert the number, x divided by y, to a float. And I can do this in a couple of ways.   

One, I could literally change all of this to floats and just avoid the problem altogether. Use float, use get_float, use percent f, and I'm done. But if I want to use ints for whatever reason-- because I want the user to type in integers, but I want to show them real numbers with decimal points for correct math-- I can do what's called casting a value.   

I can, in parentheses-- which is a weird new use of parentheses-- I can say, hey, computer, please treat the following integer as a float instead, thereby avoiding truncation. Do not truncate for me. So if I now run make calculator again, "./calculator," and type in, for instance, 1 for x, 3 for y, now I get an actual floating point value. I'm formatting it as such. And I'm telling the computer to actually arithmetically calculate it as such as well.   

But here, too, I'm kind of cheating you of a reality. It turns out-- let me clear this screen here. And it turns out that there are fancy ways in printf to tell it how many digits to show you, how many significant digits. And the syntax is very weird. I have to look it up constantly.   

But instead of just saying percent f, you literally put some numbers in between there. And you say point 5. And that will say-- it's weird syntax-- hey, printf, format this to five digits instead.   

So let me go ahead and do make calculator again, "./calculator." And let's do 1 divided by 3. And indeed, I get five significant digits there. But suppose I get a little crazy and I want 50 significant digits. Well, according to grade school, I should just see more 3's. But watch this.   

Make calculator, "./calculator." And it turns out that whoever taught you grade-school math was kind of telling you some white lies because if you really do it with a powerful Mac or PC or phone, one third is actually 0.3333333334326744079-- [SIGHS] who's right? Mr. and Mrs. So-and-so from grade school or the internet?   

What's going on here? What explains this? It all comes down somehow to [? weak ?] zeros and ones. Why is this floating point number imprecise, so to speak? What's the intuition? Yeah.   

AUDIENCE: Is this similar to what happened earlier where there was an overflow?   

DAVID J. MALAN: Yeah, similar in spirit. Just as ints only use 32 bits, floats also use only 32 bits. If you want more, just as int has long, floats have something called "double." So I could avoid some of the problem by switching to double. But that's still going to be finite.   

And if you think about this intuitively, if you're using a finite number of bits, be it 32 or 64, you can only represent literally so many patterns and thus so many floating point values, so many real numbers. But how many real numbers are there in the world? Literally infinitely many, is the challenge of real numbers. You can just keep adding numbers after the digit.   

So how could a computer, Mac, PC, or otherwise, possibly represent every floating point value super precisely if there's not enough patterns to represent every number in the world? Moreover, the way that computers use to represent numbers sometimes do not allow them to represent numbers so precisely. We can get more significant digits maybe, but not 100% perfection or precision.   

So floating point precision, too, is a fundamental problem with computers today. And unless, again, you're using a specialized language or library that understands, for scientific computing, the implications of overflow or imprecision, your code will have mistakes, much like Boeing discovered, much like Pac-Man discovered as well.   

And in fact, just to end on a gloom-and-doom note, it turns out there's another problem like this on the horizon already. So back in my day, everyone was really worried about the Y2K problem, the Year 2000 problem. Why? Because for decades, when computers were invented, most systems were using just two digits-- independent of bits-- two digits to represent years.   

Why? Computers came out a few decades ago. Who'd think that a computer is still going to be running decades later? Turns out they were, especially in government and corporations and the like. But if you're only using two digits to represent years and the millennium comes around and it's 1999 about to roll over, about to roll over, what comes after 1999?   

Well, if you're only using two digits, ideally 2000. But if you're only using two digits, the year 0 comes after the year 1999. And the whole world, truly-- you can look it up nowadays on Wikipedia-- was freaking out because there was so much old software in the world that could have had this mistake. And who knows? Planes falling out of the sky, computers rebooting, freezing. No one really knew because this was an unhandled situation in code.   

So thankfully, the world actually got its act together. The world did not end in the year 2000. And most systems were updated in time without crazy horror stories. But we're going to have this happen again because it turns out just a few years from now, at this point, computers for years have been using 32-bit integers to keep track of time in the sense of what time of day it is.   

And the point in time they decided years ago was, like, hey everyone, let's just keep track of how many seconds have passed since January 1, 1970. And we can relatively compute time any time thereafter.   

So that's great. That gives us a lot of decades' worth. But 32 bits eventually maxes out at, like, 4 billion positive, or 2 billion if you want negative and positive. And it turns out, if you count the number of seconds between 1970 on up, on the day January 19, 2038, the world might again end because all of these clocks are going to overflow. And we're going to end up in the year 0 or negative something.   

Now, what's the solution there? I mean, my god, it's the exact same thing. Stop using so few bits. Use more bits. But bits and memory and computers used to be expensive. Nowadays, storage is so much more available. But among the things we'll discuss then is how you can throw both hardware and software at this problem. But for now, maybe set a Google Calendar reminder for January 19, 2038. And hopefully we'll see you next week.   

[APPLAUSE]   [掌声]

[CLASSICAL MUSIC]   

  查看源代码