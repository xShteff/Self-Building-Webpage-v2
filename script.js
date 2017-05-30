var SelfBuildingSite = {
    Settings: {
        intervalTime: 50,
        breakTime: 500,
        textInputSelector: '#textInput',
        tabSpace: 3
    },
    Regex: {
        newLine: /(\r\n|\n|\r)/gm,
        endSentence: /(\.|\!|\?)/gm,
        tab: /(\t)/gm,
        commentStart: /(\/\*)/gm,
        commentEnd: /(\*\/)/gm,
        isCommentStart: function (c) {
            var chars = [
                SelfBuildingSite.Content.text.charAt(SelfBuildingSite.Content.currentCharCount),
                SelfBuildingSite.Content.text.charAt(SelfBuildingSite.Content.currentCharCount + 1),
            ]
            if (chars[0] === "/" && chars[1] == "*")
                return true;

            return false;
        },
        isCommentEnd: function (c) {
            var chars = [
                SelfBuildingSite.Content.text.charAt(SelfBuildingSite.Content.currentCharCount),
                SelfBuildingSite.Content.text.charAt(SelfBuildingSite.Content.currentCharCount + 1),
            ]
            if (chars[0] === "*" && chars[1] == "/")
                return true;

            return false;
        },
        isTab: function (c) {
            var result = true;
            var chars = [
                SelfBuildingSite.Content.text.charAt(SelfBuildingSite.Content.currentCharCount),
                SelfBuildingSite.Content.text.charAt(SelfBuildingSite.Content.currentCharCount + 1),
                SelfBuildingSite.Content.text.charAt(SelfBuildingSite.Content.currentCharCount + 2)
            ];
            for (var i = 0; i < chars.length; i++)
                if (chars[i] != " ")
                    result = false;

            return result;
        },
        isNewLine: function (c) {
            return SelfBuildingSite.Regex.newLine.test(c);
        },
        isEndSentence: function (c) {
            return SelfBuildingSite.Regex.endSentence.test(c);
        }
    },
    Content: {
        currentCharCount: 0,
        text: $('#cheatsydoodle').text(),
        stripHTML: function (text) {
            return text.replace(/<(?:[^>=]|='[^']*'|="[^"]*"|=[^'"][^\s>]*)*>/gm, "");
        },
        stripHTMLbutBr: function (text) {
            return text.replace(/<(?!br\s*\/?)[^>]+>/gm, "");
        },
        fancifyEverything: function () {
            var old = $('#textInput').html();
            $('#textInput').html(SelfBuildingSite.Content.stripHTMLbutBr(old)
                .replace(/\/\*/gm, "<span class='comment'>/*")
                .replace(/\*\//gm, "*/</span>")
                .replace(/<br>/gm, "\n")
                .replace(/(\.|#)(.*)(\d|){/gm, "<span class='selectorTwo'>$1$2</span> {")
                .replace(/(body)(.*)(\d|){/gm, "<span class='selectorOne'>$1</span> {") //Meh, will find another way of doing it.
                .replace(/(.*):(.*);/gm, "<span class='property'>$1</span>:<span class='value'>$2</span>;")
                .replace(/\n/gm, "<br>")
            );
        },
        isDone: function () {
            return SelfBuildingSite.Content.currentCharCount === SelfBuildingSite.Content.text.length;
        },
        startSpan: function (className) {
            var spanStart = "<span class='" + className + "'>";
            $(SelfBuildingSite.Settings.textInputSelector).append(spanStart);
        },
        endSpan: function () {
            $(SelfBuildingSite.Settings.textInputSelector).append("</span>");
        },
        addTab: function () {
            for (var i = 0; i < SelfBuildingSite.Settings.tabSpace; i++)
                $(SelfBuildingSite.Settings.textInputSelector).append("&nbsp;");
        },
        addNewLine: function () {
            $(SelfBuildingSite.Settings.textInputSelector).append("<br>");
        },
        AddCharacter: function (c) {
            var displayText = $(SelfBuildingSite.Settings.textInputSelector).html();
            $(SelfBuildingSite.Settings.textInputSelector).html(displayText + c);
        },
        UpdateStyleSheet: function () {
            $('#stylesheet').text(SelfBuildingSite.Content.stripHTML($(SelfBuildingSite.Settings.textInputSelector).text().replace(/\s\s\s/g, ' ')));
        }
    },
    Progress: function () {
        var character = SelfBuildingSite.Content.text.charAt(SelfBuildingSite.Content.currentCharCount);
        var isEndSentence = SelfBuildingSite.Regex.isEndSentence(character); //For some reason I have to do it like this.
        var isTab = SelfBuildingSite.Regex.isTab();
        var isCmntStart = SelfBuildingSite.Regex.isCommentStart();
        var isCmntEnd = SelfBuildingSite.Regex.isCommentEnd();

        if (SelfBuildingSite.Regex.isNewLine(character))
            SelfBuildingSite.Content.addNewLine();
        else if (isTab)
            SelfBuildingSite.Content.addTab();
        else
            SelfBuildingSite.Content.AddCharacter(character);

        if (!SelfBuildingSite.Content.isDone())
            if (isEndSentence)
                setTimeout(SelfBuildingSite.Progress, SelfBuildingSite.Settings.breakTime);
            else
                setTimeout(SelfBuildingSite.Progress, SelfBuildingSite.Settings.intervalTime);

        $('#textInput').scrollTop($('#textInput')[0].scrollHeight);
        SelfBuildingSite.Content.fancifyEverything();
        SelfBuildingSite.Content.UpdateStyleSheet();
        if (isTab)
            SelfBuildingSite.Content.currentCharCount += 2;
        else
            SelfBuildingSite.Content.currentCharCount++;


    }
}