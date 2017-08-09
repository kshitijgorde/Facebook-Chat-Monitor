# Facebook-Chat-Monitor
Chat monitoring tool for Facebook pages

This project consists of a chrome extension plugin and a server written in PHP.

-- Project setup --
1. Extract the Zip files to your computer.
2. Copy ReadFileBackgroundExtension to your Desktop. This contains the code for chrome extension.
3. Open Google Chrome browser.
4. Type chrome://extensions in your browser address bar. This should open up your interface from chrome extensions.
5. Click on Load Unpacked Extension. On the dialog box opened thereafter select the ReadFileBackgroundExtension folder. This should install the plugin.
6. Once the plugin is installed, the facebook chat monitor becomes active.

-- Server Setup --
1. The source code for the server is given in pisp_chat_monitor.zip.
2. However, in order to use this project, it's a requirement by facebook that only developers are allowed to use it. Since I have developed the 
   facebook page and facebook app, and also have this server running on cloud9 platform, currently only I can access the contents of the page. Hence this project can be run from my account only. In order to make this app public, we need get get it reviewed from facebook since we are using 'read_mailbox' permission and also pay facebook a certain amount of fee. As for the development mode nothing is required. 
3. If you still like to use it from your facebook account, email me: kgorde@uncc.edu and I shall add you as the page administrator.

-- To test the plugin --
1. If you're an administrator of the page "ITIS 6200 Project", then open the page in facebook. Click on message which should open up a chat window.
2. Type in some suspicious keywords such as 'crime', 'murder', or 'rob a bank'. If these suspicious keywords count reaches 6, an alert box will be popped
   up with a warning.
3. To test blocking of a suspicious link, type www.pispproject.com OR www.pispunsafe.com in the chat window. Now click on that link. It should be        
   redirected to a different page on the server.


---------------------------------------------------------------------------------------------------------------------------------------------------------

----------------------------------------------------------------    TEST CASES  -------------------------------------------------------------------------
   

   1. Reading Facebook data from chat box and storing it in a file          :  Using Facebook Graph API and storing it in facebookmsg.txt file on 
                                                                               cloud9 server


   2. Browser plugin to alert user after a threshold of messages so as to   :  After suspicious count reaches 6, alert will be popped up every 5sec. 
      not crash the browser

   3. Blocking suspicious links												:  Blocking suspicious links matching the database and redirected it to safe 
                                                                               page with a warning


---------------------------------------------------------------------------------------------------------------------------------------------------------                                                                        TEST DATA

1. For the prototype, this is the database of suspicious links and keywords
   "crime","murder","criminal","suicide","knife","weapon","killing","murdering","lets rob a bank","robbery","rob","stabbing","killing him"

2. Unsafe/Suspicious links are :
   "www.pispproject.com"
   "www.pispunsafe.com"
