/**
 * @class
 * @constructor
 */
Gui.Config.View.Window.FirstTime = function () {
};

/**
 * @type {Gui.Window.Controller.Abstract}
 */
Gui.Config.View.Window.FirstTime.prototype = new Gui.Window.View.Abstract();

Gui.Config.View.Window.FirstTime.prototype.isModal = true;

Gui.Config.View.Window.FirstTime.prototype.hasHeader = true;

/**
 * decorate and render
 */
Gui.Config.View.Window.FirstTime.prototype.render = function () {

    this.addClasses().addLogo().renderHelp();

    this.node.addClass('collapsed');

    Gui.Window.View.Abstract.prototype.render.call(this);

    this.node.toggleClass('collapsed expand');
};

Gui.Config.View.Window.FirstTime.prototype.addClasses = function () {

    this.node.addClass('first-time');

    return this;
};

Gui.Config.View.Window.FirstTime.prototype.addLogo = function () {

    $('<img>').attr('src', VDRest.image.getIcon()).appendTo(this.header);

    return this;
};

Gui.Config.View.Window.FirstTime.prototype.renderHelp = function () {

    if (VDRest.config.getItem('language') == 'de_DE') {
        this.helpDe();
    } else {
        this.helpEn();
    }

    return this;
};

Gui.Config.View.Window.FirstTime.prototype.helpDe = function () {

    this.heading('Konfiguration');
    this.addParagraph('Diese App ist dafür gedacht um im Chrome Browser unter Android verwendet zu werden, sie funktioniert aber auch uneingeschränkt im Chrome auf dem Desktop. Firefox für Android wird ausdrücklich nicht empfohlen. IOS Safari kann mangels Gerät leider nicht von mir debugged werden und ich kann daher nicht garantieren, das die webapp vernünftig läuft. Schickt mir gerne eure Patches, wenn ihr einen Bug findet.');
    this.addParagraph('Für die Navigation innerhalb der App und um Fenster zu schließen wird ausschließlich die \'Zurück\' Taste benötigt. Es wird empfohlen, nach der Grundkonfiguration im Browser Menu die Option<br>\'Zum Startbildschirm hinzufügen\' zu verwenden. Anschließend kann die App über ein Icon auf dem Home Screen gestartet werden. Du kannst unter<br>\'Sonstiges -> Zeige Installationsanleitung\' diese Hinweis Seite deaktivieren.');
    this.addParagraph('Um gleich loszulegen trage bitte unter<br>Server -> Host<br>die IP Adresse oder den Hostnamen deiner Restfulapi ein.');
    this.addParagraph('Falls die Konfiguration der Restfulapi vom Standard abweicht, passe bitte auch den Port an. Auch wenn ein Standard Port wie 443 oder 80 verwendet wird, muss dieser eingetragen werden.');
    this.addParagraph('Das Protokoll muss nur angepasst werden, falls Du einen Reverse Proxy verwendest, der die Restfulapi via SSL zur Verfügung stellt (gute Wahl). Das geht z.B. mit Apache, eine Beispielkonfiguration findest Du <a target="_blank" href="https://raw.githubusercontent.com/hannemann/vdr-webapp/master/apache/vhost.conf">hier</a>.');
    this.addParagraph('Die Option \'Resourcenschonendes laden\' sollte nur aktiviert bleiben, wenn der VDR über wenig Kraftreserven verfügt. Dockstar und Co. fallen unter diese Kategorie.');
    this.addParagraph('Um Live TV oder Aufnahmen zu streamen aktiviere bitte \'Streamdev verwenden\'. Trage auch hier IP bzw. Hostname sowie den Port ein. Für Protokoll und Port gelten diesselben Regeln wie für die API.');
    this.addParagraph('Falls Du einen kompatiblen Browser verwendest, solltest Du den HTML5 Video Player aktivieren. Erfolgreich getestet wurden Google Chrome und Internet Explorer 11. Für den IE wird noch ein WebM Plugin benötigt, das von Google <a target="_blank" href="https://tools.google.com/dlpage/webmmf/">heruntergeladen</a> werden kann. Chrome spielt sowohl WebM als auch Matroska ab, IE nur WebM.');
    this.addParagraph('Die Standard externremux.sh des StreamDev Servers kann für den HTML5 Player nicht verwendet werden. Installiere bitte <a target="_blank" href="https://raw.githubusercontent.com/hannemann/vdr-webapp/master/streamdev/externremux.sh">diese</a> Version sowie ffmpeg.');
    this.addParagraph('Um LiveTV für einen Sender zu aktivieren, halte das Kanal Logo gedrückt. Das funktioniert in den Favoriten sowie im EPG. Um eine Aufnahme anzusehen, halte den Eintrag in der Aufnahmen Liste gedrückt oder tippe auf \'Aufnahme ansehen\' im Edit Tab eines Aufnahme Fensters.');
    this.addParagraph('Mehr Informationen findest Du in der <a target="_blank" href="documentation.html">Dokumentation</a> (Englisch) (noch nicht vollständig)');
    this.addParagraph('Viel Spass mit der Webapp.');
};

Gui.Config.View.Window.FirstTime.prototype.helpEn = function () {

    this.heading('Configuration');
    this.addParagraph('This webapp is intended to be used in Android Chrome Browser but it works with no limitations on Desktop Chrome also. Firefox for Android is not recommended explicitly. Since i don\'t own an IOS Safari and hence cannot debug i can\'t guarantee that the webapp works flawlessly. Feel free to send me a patch if you find a bug.');
    this.addParagraph('To navigate through the app and close windows use the \'Back\' button of your browser. It is recommended to add the webapp to your Home Screen by using the appropriate option of your browser menu. Afterwards you can start the app via an icon on your Home Screen. Disable this message under \'Misc. -> Show first time installation guide\'.');
    this.addParagraph('To start right away please enter the IP or hostname of your Restfulapi under<br>Server -> Host');
    this.addParagraph('If the configuration of your Restfulapi differs from standard adjust port and protocol also. You have to enter the port even if a standard port like 443 or 80 is used.');
    this.addParagraph('The protocal has to be adjusted only if a reverse proxy is used to serve Restfulapi via SSL (good choice). You can find an example on how to achieve this with Apache <a target="_blank" href="https://raw.githubusercontent.com/hannemann/vdr-webapp/master/apache/vhost.conf">here</a>.');
    this.addParagraph('The option \'Resource efficient loading\' should be left active, if your VDR does not have much Power like Dockstar and other ARM devices.');
    this.addParagraph('To watch LiveTV or recordings activate \'Use Streamdev\'. Please enter IP or Hostname and Port of your StreamDev Server also. Port and protocol are subject for the same rules as for the API.');
    this.addParagraph('If your browser is compatible, you should activate the HTML5 Video Player. Google Chrome and Internet Explorer 11 have been tested successfully. For IE a WebM Plugin is needed, that con be downloaded from Google <a target="_blank" href="https://tools.google.com/dlpage/webmmf/">heruntergeladen</a>. Chrome decodes WebM and Matroska, IE WebM only.');
    this.addParagraph('The standard externremux.sh of StreamDev Server plugin cannot be used for the HTML5 Player. Please install <a target="_blank" href="https://raw.githubusercontent.com/hannemann/vdr-webapp/master/streamdev/externremux.sh">this</a> Version and ffmpeg.');
    this.addParagraph('To watch LiveTV of a specific channel, press and hold its logo. That works with your favourites in the drawer (tap icon in menubar) and in any EPG view. To watch a recording, press and hold its entry in the recordings list or tab \'Watch Recording\' in the Edit tab of its window.');
    this.addParagraph('For further information refer to the <a target="_blank" href="documentation.html">documentation</a> (not finished yet)');
    this.addParagraph('Have fun!')
};

Gui.Config.View.Window.FirstTime.prototype.heading = function (text) {

    $('<h1>').html(text).appendTo(this.body);
};

Gui.Config.View.Window.FirstTime.prototype.addParagraph = function (text) {

    $('<p>').html(text).appendTo(this.body);
};