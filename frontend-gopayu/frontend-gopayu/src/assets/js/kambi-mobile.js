
        // function readCookie(name) {
        //     var nameEQ = name + "=";
        //     var ca = document.cookie.split(';');
        //     for (var i = 0; i < ca.length; i++) {
        //         var c = ca[i];
        //         while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        //         if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        //     }
        //     return '';
        // }

        // var stateAuth = "false";
        // if (readCookie("token") != '') {
        //     stateAuth = "true";
        // }


        // //if (typeof window._kc === "undefined") {
        //     window._kc = {
        //         currency: 'COP',
        //         playerId: readCookie("accessPlayer"),
        //         customerData: '',
        //         ticket: readCookie("accessToken"),
        //         locale: 'es_ES',
        //         market: 'CO',
        //         streamingAllowedForPlayer: 'true',
        //         oddsFormat: 'decimal',
        //         racingMode: 'false',
        //         enablePush: 'true',
        //         showPushStatus: 'true',
        //         //token: '',
        //         auth: stateAuth
        //     };
        //}


            

            (function (global) {
                //---------------------------------------------------------------------
                //
                //  Public methods
                //
                //---------------------------------------------------------------------
                /**
                 * Customer settings object which provides settings properties and functions
                 * for which the Kambi application will integrate with.
                 *
                 * Notes:
                 * - Unless specified, data must be returned synchronously.
                 * - If multiple languages are supported, a CustomerSettings file must be
                 *      created and translated for each language. The customers index HTML
                 *      page must return the correct translated settings file.
                 *
                 * @class CustomerSettings
                 */
                var CustomerSettings = function () {
                    /**
                     * Added to test new Framework layout
                     */
    
    
                    /*Added by ulrik petition 20161123*/
                    this.enableMyBonusOffers = true;
    
                    this.routeRoot = "";
                    this.fixedHeaderHeight = 0;
                    this.enableNewFrameworkLayout = true;
                    this.hideHeader = true;
    
                    //                this.hideFooter = true;
                    //
                    this.enableLandingPageFeed = true;
                    this.enableLandingPageLiveRightNow = true;
                    this.enableGroupListWidget = true;
                    this.enableMostPopular = true;
    
                    this.attachBetslipToBody = false;
    
    
                    this.enablePinnedBetslip = false;
    
                    this.enablePreviouslySearchedTerms = true;
                    this.enableFootballVisualisation = true;
                    this.enableQuickBrowse = true;
                    this.enableLiveStats = true;
    
    
                    this.enableTermSearch =true;
                    this.enableLandingPageCardHighlights = true;
                    this.enableLandingPageCardStartingSoonAggregate = true;
                    this.enableLandingPageCardStartingSoon = true;
                    this.enableLandingPageCardTrending = true;
                    this.enableLandingPageLiveRightNow = true;
    
                    // if (!this.account) {
                    //     this.account = {};
                    // }
                    // if (!this.account.links) {
                    //     this.account.links = {};
                    // }
                    // if (!this.account.links.bethistory) {
                    //     this.account.links.bethistory = {};
                    // }
                    // if (!this.account.links.bethistory.url) {
                    //     this.account.links.bethistory.url = "";
                    // }
                    // this.account.links.bethistory.url = "bethistory";
    
                    // if (!this.account.links.settings) {
                    //     this.account.links.settings = {};
                    // }
                    // if (!this.account.links.settings.url) {
                    //     this.account.links.settings.url = "";
                    // }
                    // this.account.links.settings.url = "settings";
                    /**
                     * The URL location to redirect to when the user clicks on the
                     * customers logo in the header. This URL can be an absolute URL or
                     * a relative URL which is relative to the HTML file.
                     *
                     * @type String
                     * @default undefined
                     */
                    //                this.homeUrl = "https://localhost:9007/#//";
                    this.homeUrl = "";
                    /**
                     * The URL location to redirect to when the user clicks on the
                     * login button in the header. This URL can be an absolute URL or
                     * a relative URL which is relative to the HTML file.
                     *
                     * @type String
                     * @default undefined
                     */
                    this.loginUrl = undefined;
                    /**
                     * The URL location to redirect to when the user clicks on the lobby
                     * button in the header. This URL can be an absolute URL or
                     * a relative URL which is relative to the HTML file.
                     *
                     * @type String
                     * @default undefined
                     */
                    //                this.lobbyUrl = "http://localhost:9007/#//";
                    this.lobbyUrl = "";
                    /**
                     * Toogles the visibility of deposit button/links.
                     *
                     * @type Bool
                     * @default undefined
                     */
                    this.enableDeposit = undefined;
                    /**
                     * The URL location to redirect to when the user wants to deposit
                     * money into his/her account. This URL can be an absolute URL or
                     * a relative URL which is relative to the HTML file.
                     *
                     * @type String
                     * @default undefined
                     */
                    this.depositUrl = undefined;
                    /**
                     * Toggles live betting. When set to false no live events or live
                     * bet offers will be available in the client.
                     *
                     * @type Boolean
                     * @default true
                     */
                    this.enableLiveBetting = true;
                    /**
                     * Toggles visibility of odds format selector in the client
                     *
                     * @type Boolean
                     * @default false
                     */
                    this.enableOddsFormatSelector = false;
                    /**
                     * For tracking with Google Universal Analytics.
                     * Google calls this the Web Property Id and
                     * calls it UA-XXXX-Y in their documentation.
                     *
                     * @type String
                     * @default ''
                     */
                    //this.googleAnalyticsWebPropertyID = 'UA-68341516-3';
                    this.googleAnalyticsWebPropertyID = 'UA-102849729-4';
                    /**
                     * Enables live betting by phone only mode.
                     *
                     * @type Boolean
                     * @default false
                     */
                    this.liveBettingByPhoneOnlyEnabled = false;
                    /**
                     * Live betting by phone only:
                     * The phone number to be called when a call button is activated.
                     * ! Observe this is the actual number to be called !
                     *
                     * @type String
                     * @default undefined
                     */
                    this.liveBettingPhoneNumber = undefined;
                    /**
                     * Live betting by phone only:
                     * A freetext string which will replace the phone number to be called. Only for presentational use.
                     *
                     * Appended to a more generic message regarding Call to place bet. In dialogues etc.
                     *
                     * @type String
                     * @default undefined
                     */
                    this.liveBettingHumanReadablePhoneNumber = undefined;
                    /**
                     * Live betting by phone only:
                     * A freetext string witch will added to the more generic message regarding Call to place bet.
                     *
                     * It tells which regulation applies
                     * E.g 'Australian regulations'
                     *
                     * @type String
                     * @default undefined
                     */
                    this.liveBettingRegulationString = undefined;
                    /**
                     * An object containing the different links that are available in the
                     * account section in the client.
                     *
                     * Link information should be presented as an object where the name of
                     * the object is the link 'type'. The 'type' is used within the app to
                     * display the right icon next to the link, if applicable. The link
                     * 'type' can be a pre-defined type that the client is aware of, or any
                     * custom type defined by the customer.
                     *
                     * Each link is defined with the following properties:
                     *      - url: The URL of the link
                     *      - label: The label to display for the link
                     *      - sortOrder: The sort order of the link. Should be a whole
                     *          number. The lower the number, the higher up on the page
                     *          the link should be. Sort order 1 is the first item
                     *      - external: True if the link is opened in a new window or false
                     *          in the same window [Optional]
                     *      - skipAnimation: To skip the closing animation of the account
                     *          menu when opening links
                     *
                     * @type Object
                     * @default undefined
                     */
                    this.accountLinks = {
                        // NOTE: This is only example code. Customer should replace with their
                        // own implementation
                        support: {
                            url: 'http://kambi.com/',
                            label: 'Support',
                            sortOrder: 1,
                            external: true
                        },
                        deposit: {
                            url: 'http://kambi.com/',
                            label: 'Deposit',
                            sortOrder: 2,
                            external: true
                        },
                        faq: {
                            url: 'http://kambi.com/',
                            label: 'FAQ',
                            sortOrder: 3,
                            external: true
                        }
                    };
    
                    // this.navigationTopLinks = {
                    //     'Volvió el fútbol colombiano': {
                    //         url: '#filter/football/colombia',
                    //         label: '🇨🇴 Volvió el Fútbol Colombiano',
                    //         title: '🇨🇴 Volvió el Fútbol Colombiano',
                    //         order: 1,
                    //         external: false,
                    //     },
                    //     'Sudamericana': {
                    //         url: '#filter/football/copa_sudamericana',
                    //         label: '📺 Sudamericana - En Vivo',
                    //         title: '📺 Sudamericana - En Vivo',
                    //         order: 2,
                    //         external: false,
                    //     },
                    //     'International Champions Cup': {
                    //         url: '#filter/football/club_tournaments/international_champions_cup',
                    //         label: '⚽ International Champions Cup',
                    //         title: '⚽ International Champions Cup',
                    //         order: 3,
                    //         external: false,
                    //     }
                    // };
    
                    this.navigationTopLinks = {
                        
                    };
    
                    /**
                     * An object containing the different links that are available in the
                     * footer in the client.
                     *
                     * Link information should be presented as an object where the name of
                     * the object is the link 'type'. The 'type' is used within the app to
                     * display the right icon next to the link, if applicable. The link
                     * 'type' can be a pre-defined type that the client is aware of, or any
                     * custom type defined by the customer.
                     *
                     * Each link is defined with the following properties:
                     *      - url: The URL of the link
                     *      - label: The label to display for the link
                     *      - sortOrder: The sort order of the link. Should be a whole
                     *          number. The lower the number, the higher up on the page
                     *          the link should be. Sort order 1 is the first item
                     *      - external: True if the link is opened in a new window or false
                     *          in the same window [Optional]
                     *      - featured: True if the link is to be highlighted on the start
                     *          page below the normal content but above all other footer
                     *          links. The link will be displayed as a full-width link with
                     *          a pre-defined icon on the right. [Optional]
                     *
                     * If the link is an image link the following should be added:
                     *      - imageHref: The url to the image that should be shown as a link
                     *      - label: Note that the label will be used as the 'alt' property
                     *          of the HTML img tag (shown if the image URL is wrong, image
                     *          type is not supported and while the image is downloading).
                     *
                     * @type Object
                     * @default undefined
                     *
                     * E.g.:
                     */
                    this.footerLinks = {
                    };
                    /**
                     * DEPRECATED - Use this.bethistoryLinks instead
                     */
                    this.betslipLink = {
                    };
                    /**
                     * An object containing the optional links to be displayed at the bottom
                     * of the betslip.
                     *
                     * The link is defined with the following properties:
                     *      - url: The URL of the link
                     *      - label: The label to display for the link
                     *      - external: True if the link is opened in a new window or false in
                     *          the same window [Optional]
                     *
                     * @type Object
                     * @default undefined
                     */
                    this.betslipLinks = {
                        // NOTE: This is only example code. Customer should replace with their
                        // own implementation
                      /*  link: {
                            url: 'http://www.juegoseguro.es/',
                            label: 'Juego Seguro',
                            external: true
                        }*/
                    };
                    /**
                     * An object containing the optional links to be displayed at the bottom
                     * of the bet history, below the 'More' bets link.
                     *
                     * The link is defined with the following properties:
                     *      - url: The URL of the link
                     *      - label: The label to display for the link
                     *      - external: True if the link is opened in a new window or false in
                     *          the same window [Optional]
                     *
                     * @type Object
                     * @default undefined
                     */
                    this.bethistoryLinks = {
                        // NOTE: This is only example code. Customer should replace with their
                        // own implementation
                        link: {
                            url: 'http://www.ordenacionjuego.es/es/normas-vigor',
                            label: 'Regulaci&oacute;n Espa&ntilde;ola',
                            external: true
                        }
                    };
                    /**
                     * Toggles visibility of the navigation menu in the client (if browser-window is wide enough)
                     *
                     * @type Boolean
                     * @default false
                     */
                    this.enableNavigationPanel = true;
                };
                /**
                 * Returns the current balance of the logged in user. This function returns
                 * data asynchronously by the use of callback functions.
                 *
                 * The success function should be called when the customers request for the
                 * balance is successful. The success function should be supplied with
                 * the balance (Number) as a parameter.
                 *
                 * The failure function should be called when the customers request for the
                 * balance has failed. The failure function should be supplied with the
                 * XMLHttpRequest object as a parameter.
                 *
                 * @param {Function} successFunc Success callback function
                 * @param {Function} failureFunc Failure callback function
                 * @param {Function} $ Reference to jQuery library, loaded internaly
                 */
                // CustomerSettings.prototype.getBalance = function (successFunc, failureFunc, $) {
                //     // NOTE: This is only example code. Customer should replace with their
                //     // own implementation
                //     $.ajax({
                //         url: "data/Balance.json?cb=" + Math.random(),
                //         success: function (response, responseType, xhr) {
                //             // The response sent to the success function should be the
                //             // actual balance value
                //             successFunc(parseFloat(response));
                //         },
                //         error: function (xhr) {
                //             // The response sent to the failure function should be the
                //             // XHR object
                //             failureFunc(xhr);
                //         }
                //     });
                // };
                /**
                 * Inform the customer that the current user should be logged out.
                 *
                 * It is the responsibility of the customer to make sure that the user is
                 * logged out and that the HTML page is reloaded afterwards.
                 *
                 * @param {Function} $ Reference to jQuery library, loaded internaly
                 */
                CustomerSettings.prototype.logout = function ($) {
                    //alert("logout");
                };
                /**
                 * Inform the customer to keep the logged in users session alive.
                 *
                 * @param {Function} $ Reference to jQuery library, loaded internaly
                 */
                CustomerSettings.prototype.heartbeat = function ($) {
                    //alert("heartbeat");
                };
                /**
                 * Informs the operator with app specific events.
                 * See https://kambiservices.atlassian.net/wiki/display/Kambi/Catalog+of+notification+events for catalog of notification events
                 * @param {Object} event
                 * @param {Function} $ Reference to jQuery library, loaded internaly
                 */
                CustomerSettings.prototype.notification = function (event, $) {
                    //console.log("-----------------------------------------");
                    //console.log(event);
                    //console.log("-----------------------------------------");
                };
                // Set the customer callbacks to the global space
                global.customerSettings = new CustomerSettings();
            }(window));
       
    