var SelfBuildingSite = {
    Settings: {
        intervalTime: 50,
        breakTime: 1000,
        textInputSelector: '#textInput',
        tabSpace: 3
    },
    Regex: {
        newLine: /(\r\n|\n|\r)/gm,
        endSentence: /(\.|\!|\?)/gm,
        tab: /(\t)/gm,
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
        isDone: function () {
            return SelfBuildingSite.Content.currentCharCount === SelfBuildingSite.Content.text.length;
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
            $('#stylesheet').text($(SelfBuildingSite.Settings.textInputSelector).text().replace(/\s\s\s/g, ' '));
        }
    },
    Progress: function () {
        var character = SelfBuildingSite.Content.text.charAt(SelfBuildingSite.Content.currentCharCount);
        var isEndSentence = SelfBuildingSite.Regex.isEndSentence(character); //For some reason I have to do it like this.
        var isTab = SelfBuildingSite.Regex.isTab();
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

        SelfBuildingSite.Content.UpdateStyleSheet();
        if (isTab)
            SelfBuildingSite.Content.currentCharCount += 2;
        else
            SelfBuildingSite.Content.currentCharCount++;


    }
}