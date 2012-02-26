# AWSTATS SEARCH ENGINES DATABASE
#------------------------------------------------------------------------------
# If you want to add a Search Engine to extend AWStats database detection capabilities,
# you must add an entry in SearchEnginesSearchIDOrder, SearchEnginesHashID and in
# SearchEnginesHashLib.
# An entry if known in SearchEnginesKnownUrl is also welcome.
#------------------------------------------------------------------------------
# $Revision: 1.45 $ - $Author: eldy $ - $Date: 2007/09/11 18:51:20 $

# 2005-08-19 Sean Carlos http://www.antezeta.com/awstats.html
#            added minor italian search engines
#                  arianna http://arianna.libero.it/
#                  supereva http://search.supereva.com/
#                  kataweb http://kataweb.it/
#            corrected uk looksmart
#                  'askuk','ask=', 'bbc','q=', 'freeserve','q=', 'looksmart','key=',
#            to 
#                  'askuk','ask=', 'bbc','q=', 'freeserve','q=', 'looksmartuk','key=',
#            corrected spelling
#                     internationnal -> international
#            added 'google\.'=>'mail\.google\.', to NotSearchEnginesKeys in order to
#            avoid counting gmail referrals as search engine traffic
# 2005-08-21 Sean Carlos http://www.antezeta.com/awstats.html
#            avoid counting babelfish.altavista referrals as search engine traffic
#            avoid counting translate.google referrals as search engine traffic
# 2005-11-20 Sean Carlos
# 	     added missing 'tiscali','key=', entry.  Check order
# 2005-11-22 Sean Carlos
# 	     added Google Base & Froogle.  Froogle not tested.
# 2006-04-18 Sean Carlos http://www.antezeta.com/awstats.html
# 	     added biglotron.com (France)
# 	     added blingo http://www.blingo.com/
# 	     added Clusty & Vivisimo
# 	     added eniro.no (Norway) [https://sourceforge.net/forum/message.php?msg_id=3134783]
# 	     added GPU p2p search http://search.centraldatabase.org/
# 	     added mail.tiscali to "not search engines list" [https://sourceforge.net/forum/message.php?msg_id=3166688]
# 	     added Ask group's "mysearch"
# 	     added sify.com (India)
# 	     added sogou.com (Cina) [https://sourceforge.net/forum/message.php?msg_id=3501603]
# 	     Ask changes:
# 	     - added Ask Japan (ask.jp)	
# 	     - break out Ask new country level variants (DE, ES, FR, IT, NL)
# 	     - updated Ask name from Ask Jevees
# 	     - added Ask q= parameter - many recent searches probably not recognized; [https://sourceforge.net/forum/message.php?msg_id=3465444]
# 	     - updated Ask uk (new uk.ask.com added to older ask.co.uk)
# 	     updated voila kw|rdata parameter [https://sourceforge.net/forum/message.php?msg_id=3373912]
#	     for each new engine, added link to Search Engine.  This serves to document engine. Done for major & Italian engines as well. Requires patch
#		to AWStats to allow untranslated html.  Otherwise html will appear instead of link.
#	     reviewed mnoGoSearch (http://www.mnogosearch.org/); the search engined mentioned no longer
#		exists https://sourceforge.net/forum/message.php?msg_id=3025426
# 2006-05-13 Sean Carlos http://www.antezeta.com/awstats.html
#            added 10 Chello European broadband portals (Austria, Belgium, Czech Republic, France, Hungary, The Netherlands, Norway, Poland, Slovakia, Sweden)
#	     added Alice Internal Search (blends data with Google?) search.alice.it.master:10005
#            added detection of google cache views from IPs 66.249.93.104 72.14.203.104 72.14.207.104
#		To do: add more extensive IP list; keywords not yet detected.
#            added icerocket.com blog search http://www.icerocket.com/
#	     added live.com (msn) http://www.live.com/
# 	     added Meta motor kartoo.  Note: Kartoo does not provide search words in referrers, thus the engine will appear in the
#		search engine list but the actual search words are not available.
#	     added netluchs.de http://www.netluchs.de/
#	     added sphere.com blog search http://www.sphere.com/
#	     added wwweasel.de http://wwweasel.de
#	     added Yahoo Mindset! http://mindset.research.yahoo.com/
#            updated Mirago query parameter recognition (qry=); added breakout for each country (France, Germany, Spain, Italy, Norway, Sweden, Denmark, Netherlands, Belgium, Switzerland)
# 2006-05-13 Sean Carlos http://www.antezeta.com/awstats.html 
#	     added Google cache IPs 64.233.183.104 & 66.102.7.104
# 2006-05-20 Sean Carlos http://www.antezeta.com/awstats.html 
#		anzwers.com.au
#		schoenerbrausen.de http://www.schoenerbrausen.de/
#		added Google cache IP 216.239.59.104
#		answerbus http://www.answerbus.com/ (does not provide keywords)
# 2006-05-23 Sean Carlos http://www.antezeta.com/awstats.html
#		added Google cache IP 66.102.9.104, 64.233.161.104
# 2006-06-23 Sean Carlos http://www.antezeta.com/awstats.html 
#	     	added Alice Search search.alice.it
#		added GoodSearch http://www.goodsearch.com/ (does not provide keywords) "a Yahoo-powered search engine that donates money to your favorite charity or school each time you search the web"
#		added googlee.com, variant of Google
#		added gotuneed http://www.gotuneed.com/ Italian search engine, in beta
#		added icq.com
#		added logic to parse Google Cache search keywords. Seems to work for alpha but not numeric cache IDs, i.e. search?q=cache:lWVLmnuGJswJ: is recognized but q=cache:Yv5qxeJNuhgJ: is not recognized. The URL triggering the keywords will also appear.  The URLs are probably too varied to parse out?
#		added Nusearch http://www.nusearch.com/
#		added Polymeta www.polymeta.hu (does not provide keywords)
#		added scroogle http://www.scroogle.org/ (does not always provide keywords)
#		added Tango http://tango.hu/search.php?st=0&q=jeles+napok
#		Changed Google Cache notation 64\.233\.(161|167|179|183|187)\.104 to 64\.233\.1[0-9]{2}\.104
#		 			      72\.14\.(203|205|207|209|221)\.104 to 72\.14\.2[0-9]{2}\.104
#					      216\.239\.(51|59)\.104 to 216\.239\.5[0-9]\.104
#					      66\.102\.(7|9)\.104 to 66\.102\.[1-9]\.104
# 2006-06-27 Sean Carlos http://www.antezeta.com/awstats.html
#		added Onet.pl http://szukaj.onet.pl/ 
#		corrected name "Wirtualna Polska" from "Szukaj" (search); added link http://szukaj.wp.pl/ 
# 2006-06-30 Sean Carlos http://www.antezeta.com/awstats.html
#	Additional Polish Search Engines:
#	added Dodaj.pl http://www.dodaj.pl/
#	added Gazeta.pl http://szukaj.gazeta.pl/
#	added Gery.pl http://szukaj.gery.pl/
#	added Hoga.pl http://www.hoga.pl/
#	added Interia.pl http://www.google.interia.pl/
#	added Katalog.Onet.pl http://katalog.onet.pl/
#	added NetSprint.pl http://www.netsprint.pl/
#	added o2.pl http://szukaj2.o2.pl/
#	added Polska http://szukaj.polska.pl/
#	added Szukacz http://www.szukacz.pl/
#	added Wow.pl http://szukaj.wow.pl/
#	added Sagool http://sagool.jp/

# 2006-08-25 Social Bookmarks
#	International
#	added del.icio.us/search - for now, just search referrer. To do: consider /tag/(tagname) referrer?
# 	added stumbleupon.com - No keywords supplied.
#	added swik.net
#       added digg. Keywords sometimes supplied.
#	Italy
# 	added segnalo.alice.it - No keywords supplied.
#	added ineffabile.it - No keywords supplied.

#       added filter for google groups.  Attempt to parse group name as keyword.

# 2006-09-14 
#	added Eniro Sverige http://www.eniro.se/
#	added MyWebSearch http://search.mywebsearch.com/ 
#	added Teecno http://www.teecno.it/ Italian Open Source Search Engine

#package AWSSE;

# 2006-09-25 (Gabor Moizes)
# added 4-counter (Google alternative) http://4-counter.com/
# added Googlecom (Google alternative) http://googlecom.com/
# added Goggle (Google alternative) http://goggle.co.hu/
# added Comet toolbar http://as.starware.com
# added new IP for Yahoo: 216.109.125.130
# added Ledix http://ledix.net/
# added AT&T search (powered by Google) http://www.att.net/
# added Keresolap (Hungarian search engine) http://www.keresolap.hu/
# added Mozbot (French search engine) http://www.mozbot.fr/
# added Zoznam (Slovak search engine) http://www.zoznam.sk/
# added sapo.pt (Portuguese search engine) http://www.sapo.pt/
# added shaw.ca (powered by Google) http://start.shaw.ca/
# added Searchalot http://www.searchalot.com/
# added Copernic http://www.copernic.com/
# added 216.109.125.130 to Yahoo
# added 66.218.69.11 to Yahoo
# added Avantfind http://www.avantfind.com/
# added Steadysearch http://www.steadysearch.com/
# added Steadysearch http://www.steady-search.com/
# modified 216\.239\.5[0-9]\.104/search to 216\.239\.5[0-9]\.104


# SearchEnginesSearchIDOrder
# It contains all matching criteria to search for in log fields. This list is
# used to know in which order to search Search Engines IDs.
# Most frequent one are in list1, used when LevelForSearchEnginesDetection is 1 or more
# Minor robots are in list2, used when LevelForSearchEnginesDetection is 2 or more
# Note: Regex IDs are in lower case and ' ' and '+' are changed into '_'
#------------------------------------------------------------------------------
@SearchEnginesSearchIDOrder_list1=(
# Major international search engines
'base\.google\.',
'froogle\.google\.',
'groups\.google\.',
'images\.google\.',
'google\.',
'googlee\.',
'googlecom\.com',
'goggle\.co\.hu',
'216\.239\.(35|37|39|51)\.100',
'216\.239\.(35|37|39|51)\.101', 
'216\.239\.5[0-9]\.104', 
'64\.233\.1[0-9]{2}\.104',
'66\.102\.[1-9]\.104',
'66\.249\.93\.104',
'72\.14\.2[0-9]{2}\.104',
'msn\.',
'live\.com',
'voila\.',
'mindset\.research\.yahoo',
'yahoo\.','(66\.218\.71\.225|216\.109\.117\.135|216\.109\.125\.130|66\.218\.69\.11)',
'search\.aol\.co',
'tiscali\.',
'lycos\.',
'alexa\.com',
'alltheweb\.com',
'altavista\.',
'a9\.com',
'dmoz\.org',
'netscape\.',
'search\.terra\.',
'www\.search\.com',
'search\.sli\.sympatico\.ca', 
'excite\.'
);

@SearchEnginesSearchIDOrder_list2=(
# Minor international search engines
'4\-counter\.com',
'att\.net',
'bungeebonesdotcom',
'northernlight\.',
'hotbot\.',
'kvasir\.',
'webcrawler\.',
'metacrawler\.',
'go2net\.com',
'(^|\.)go\.com',
'euroseek\.',
'looksmart\.',
'spray\.',
'nbci\.com\/search',
'de\.ask.\com', # break out Ask country specific engines.  (.jp is in Japan section)
'es\.ask.\com',
'fr\.ask.\com',
'it\.ask.\com',
'nl\.ask.\com',
'uk\.ask.\com',
'(^|\.)ask\.com',
'atomz\.',
'overture\.com',		# Replace 'goto\.com','Goto.com',
'teoma\.',
'findarticles\.com',
'infospace\.com',
'mamma\.',
'dejanews\.',
'dogpile\.com',
'wisenut\.com',
'ixquick\.com',
'search\.earthlink\.net', 
'i-une\.com',
'blingo\.com',
'centraldatabase\.org',
'clusty\.com',
'mysearch\.',
'vivisimo\.com',
'kartoo\.com',
'icerocket\.com',
'sphere\.com',
'ledix\.net',
'start\.shaw\.ca',
'searchalot\.com',
'copernic\.com',
'avantfind\.com',
'steadysearch\.com',
'steady-search\.com',
# Chello Portals
'chello\.at',
'chello\.be',
'chello\.cz',
'chello\.fr',
'chello\.hu',
'chello\.nl',
'chello\.no',
'chello\.pl',
'chello\.se',
'chello\.sk',
'chello', # required as catchall for new countries not yet known
# Mirago 
'mirago\.be',
'mirago\.ch',
'mirago\.de',
'mirago\.dk',
'es\.mirago\.com',
'mirago\.fr',
'mirago\.it',
'mirago\.nl',
'no\.mirago\.com',
'mirago\.se',
'mirago\.co\.uk',
'mirago', # required as catchall for new countries not yet known
'answerbus\.com',
'icq\.com\/search',
'nusearch\.com',
'goodsearch\.com',
'scroogle\.org',
'questionanswering\.com',
'mywebsearch\.com',
'as\.starware\.com',
# Social Bookmarking Services
'del\.icio\.us',
'digg\.com',
'stumbleupon\.com',
'swik\.net',
'segnalo\.alice\.it',
'ineffabile\.it',
# Minor Australian search engines
'anzwers\.com\.au',
# Minor brazilian search engines
'engine\.exe', 'miner\.bol\.com\.br',
# Minor chinese search engines
'\.baidu\.com',     # baidu search portal
'\.vnet\.cn',       # powered by MSN
'\.soso\.com',      # powered by Google
'\.sogou\.com',     # powered by Sohu
'\.3721\.com',      # powered by Yahoo!
'iask\.com',        # powered by Sina
'\.accoona\.com',   # Accoona
'\.163\.com',       # powered by Google
'\.zhongsou\.com',  # zhongsou search portal
# Minor czech search engines
'atlas\.cz','seznam\.cz','quick\.cz','centrum\.cz','jyxo\.(cz|com)','najdi\.to','redbox\.cz',
# Minor danish search-engines 
'opasia\.dk', 'danielsen\.com', 'sol\.dk', 'jubii\.dk', 'find\.dk', 'edderkoppen\.dk', 'netstjernen\.dk', 'orbis\.dk', 'tyfon\.dk', '1klik\.dk', 'ofir\.dk',
# Minor dutch search engines
'ilse\.','vindex\.',
# Minor english search engines
'(^|\.)ask\.co\.uk','bbc\.co\.uk/cgi-bin/search','ifind\.freeserve','looksmart\.co\.uk','splut\.','spotjockey\.','ukdirectory\.','ukindex\.co\.uk','ukplus\.','searchy\.co\.uk',
# Minor finnish search engines
'haku\.www\.fi',
# Minor french search engines
'recherche\.aol\.fr','ctrouve\.','francite\.','\.lbb\.org','rechercher\.libertysurf\.fr', 'search[\w\-]+\.free\.fr', 'recherche\.club-internet\.fr',
'toile\.com', 'biglotron\.com', 
'mozbot\.fr', 
# Minor german search engines
'sucheaol\.aol\.de',
'fireball\.de','infoseek\.de','suche\d?\.web\.de','[a-z]serv\.rrzn\.uni-hannover\.de',
'suchen\.abacho\.de','brisbane\.t-online\.de','allesklar\.de','meinestadt\.de',
'212\.227\.33\.241',
'(161\.58\.227\.204|161\.58\.247\.101|212\.40\.165\.90|213\.133\.108\.202|217\.160\.108\.151|217\.160\.111\.99|217\.160\.131\.108|217\.160\.142\.227|217\.160\.176\.42)',
'wwweasel\.de',
'netluchs\.de',
'schoenerbrausen\.de',
# Minor Hungarian search engines
'heureka\.hu','vizsla\.origo\.hu','lapkereso\.hu','goliat\.hu','index\.hu','wahoo\.hu','webmania\.hu','search\.internetto\.hu',
'tango\.hu',
'keresolap\.hu',
'polymeta\.hu',
# Minor Indian search engines
'sify\.com',
# Minor Italian search engines
'virgilio\.it','arianna\.libero\.it','supereva\.com','kataweb\.it','search\.alice\.it\.master','search\.alice\.it','gotuneed\.com',
'godado','jumpy\.it','shinyseek\.it','teecno\.it',
# Minor Japanese search engines
'ask\.jp','sagool\.jp',
# Minor Norwegian search engines
'sok\.start\.no', 'eniro\.no',
# Minor Polish search engines
'szukaj\.wp\.pl','szukaj\.onet\.pl','dodaj\.pl','gazeta\.pl','gery\.pl','hoga\.pl','netsprint\.pl','interia\.pl','katalog\.onet\.pl','o2\.pl','polska\.pl','szukacz\.pl','wow\.pl',
# Minor russian search engines
'ya(ndex)?\.ru', 'aport\.ru', 'rambler\.ru', 'turtle\.ru', 'metabot\.ru',
# Minor Swedish search engines
'evreka\.passagen\.se','eniro\.se',
# Minor Slovak search engines
'zoznam\.sk',
# Minor Portuguese search engines
'sapo\.pt',
# Minor swiss search engines
'search\.ch', 'search\.bluewin\.ch'
);
@SearchEnginesSearchIDOrder_listgen=(
# Generic search engines
'search\..*\.\w+'
);


# NotSearchEnginesKeys
# If a search engine key is found, we check its exclude list to know if it's
# really a search engine
#------------------------------------------------------------------------------
%NotSearchEnginesKeys=(
'altavista\.'=>'babelfish\.altavista\.',
'google\.'=>'mail\.google\.',
'google\.'=>'translate\.google\.',
'msn\.'=>'hotmail\.msn\.',
'tiscali\.'=>'mail\.tiscali\.',
'yahoo\.'=>'mail\.yahoo\.',
'yandex\.'=>'direct\.yandex\.'
);


# SearchEnginesHashID
# Each Search Engine Search ID is associated to an AWStats id string
#------------------------------------------------------------------------------
%SearchEnginesHashID = (
# Major international search engines
'base\.google\.','google_base',
'froogle\.google\.','google_froogle',
'groups\.google\.','google_groups',
'images\.google\.','google_image',
'google\.','google',
'googlee\.','google',
'googlecom\.com','google',
'goggle\.co\.hu','google',
'216\.239\.(35|37|39|51)\.100','google_cache',
'216\.239\.(35|37|39|51)\.101','google_cache',
'216\.239\.5[0-9]\.104','google_cache',
'64\.233\.1[0-9]{2}\.104','google_cache',
'66\.102\.[1-9]\.104','google_cache',
'66\.249\.93\.104','google_cache',
'72\.14\.2[0-9]{2}\.104','google_cache',
'msn\.','msn',
'live\.com','live',
'voila\.','voila',
'mindset\.research\.yahoo','yahoo_mindset',
'yahoo\.','yahoo','(66\.218\.71\.225|216\.109\.117\.135|216\.109\.125\.130|66\.218\.69\.11)','yahoo',
'lycos\.','lycos',
'alexa\.com','alexa',
'alltheweb\.com','alltheweb',
'altavista\.','altavista',
'a9\.com','a9',
'dmoz\.org','dmoz',
'netscape\.','netscape',
'search\.terra\.','terra',
'www\.search\.com','search.com',
'tiscali\.','tiscali',
'search\.aol\.co','aol',
'search\.sli\.sympatico\.ca','sympatico',
'excite\.','excite',
# Minor international search engines
'4\-counter\.com','google4counter',
'att\.net','att',
'bungeebonesdotcom','bungeebonesdotcom',
'northernlight\.','northernlight',
'hotbot\.','hotbot',
'kvasir\.','kvasir',
'webcrawler\.','webcrawler',
'metacrawler\.','metacrawler',
'go2net\.com','go2net',
'(^|\.)go\.com','go',
'euroseek\.','euroseek',
'looksmart\.','looksmart',
'spray\.','spray',
'nbci\.com\/search','nbci',
'de\.ask.\com','askde', # break out Ask country specific engines.
'es\.ask.\com','askes',
'fr\.ask.\com','askfr',
'it\.ask.\com','askit',
'nl\.ask.\com','asknl',
'uk\.ask.\com','askuk',
'(^|\.)ask\.co\.uk','askuk',
'(^|\.)ask\.com','ask',
'atomz\.','atomz',
'overture\.com','overture',		# Replace 'goto\.com','Goto.com',
'teoma\.','teoma',
'findarticles\.com','findarticles',
'infospace\.com','infospace',
'mamma\.','mamma',
'dejanews\.','dejanews',
'dogpile\.com','dogpile',
'wisenut\.com','wisenut',
'ixquick\.com','ixquick',
'search\.earthlink\.net','earthlink',
'i-une\.com','iune',
'blingo\.com','blingo',
'centraldatabase\.org','centraldatabase',
'clusty\.com','clusty',
'mysearch\.','mysearch',
'vivisimo\.com','vivisimo',
'kartoo\.com','kartoo',
'icerocket\.com','icerocket',
'sphere\.com','sphere',
'ledix\.net','ledix',
'start\.shaw\.ca','shawca',
'searchalot\.com','searchalot',
'copernic\.com','copernic',
'avantfind\.com','avantfind',
'steadysearch\.com','steadysearch',
'steady-search\.com','steadysearch',
# Chello Portals
'chello\.at','chelloat',
'chello\.be','chellobe',
'chello\.cz','chellocz',
'chello\.fr','chellofr',
'chello\.hu','chellohu',
'chello\.nl','chellonl',
'chello\.no','chellono',
'chello\.pl','chellopl',
'chello\.se','chellose',
'chello\.sk','chellosk',
'chello','chellocom',
# Mirago 
'mirago\.be','miragobe',
'mirago\.ch','miragoch',
'mirago\.de','miragode',
'mirago\.dk','miragodk',
'es\.mirago\.com','miragoes',
'mirago\.fr','miragofr',
'mirago\.it','miragoit',
'mirago\.nl','miragonl',
'no\.mirago\.com','miragono',
'mirago\.se','miragose',
'mirago\.co\.uk','miragocouk',
'mirago','mirago', # required as catchall for new countries not yet known
'answerbus\.com','answerbus',
'icq\.com\/search','icq',
'nusearch\.com','nusearch',
'goodsearch\.com','goodsearch',
'scroogle\.org','scroogle',
'questionanswering\.com','questionanswering',
'mywebsearch\.com','mywebsearch',
'as\.starware\.com','comettoolbar',
# Social Bookmarking Services
'del\.icio\.us','delicious',
'digg\.com','digg',
'stumbleupon\.com','stumbleupon',
'swik\.net','swik',
'segnalo\.alice\.it','segnalo',
'ineffabile\.it','ineffabile',
# Minor Australian search engines
'anzwers\.com\.au','anzwers',
# Minor brazilian search engines
'engine\.exe','engine',
'miner\.bol\.com\.br','miner',
# Minor chinese search engines
'\.baidu\.com','baidu',
'iask\.com','iask',
'\.accoona\.com','accoona',
'\.3721\.com','3721',
'\.163\.com','netease',
'\.soso\.com','soso',
'\.zhongsou\.com','zhongsou',
'\.vnet\.cn','vnet',
'\.sogou\.com','sogou',
# Minor czech search engines
'atlas\.cz','atlas',
'seznam\.cz','seznam',
'quick\.cz','quick',
'centrum\.cz','centrum',
'jyxo\.(cz|com)','jyxo',
'najdi\.to','najdi',
'redbox\.cz','redbox',
# Minor danish search-engines 
'opasia\.dk','opasia',
'danielsen\.com','danielsen',
'sol\.dk','sol',
'jubii\.dk','jubii',
'find\.dk','finddk',
'edderkoppen\.dk','edderkoppen',
'netstjernen\.dk','netstjernen',
'orbis\.dk','orbis',
'tyfon\.dk','tyfon',
'1klik\.dk','1klik',
'ofir\.dk','ofir',
# Minor dutch search engines
'ilse\.','ilse',
'vindex\.','vindex',
# Minor english search engines
'bbc\.co\.uk/cgi-bin/search','bbc',
'ifind\.freeserve','freeserve',
'looksmart\.co\.uk','looksmartuk',
'splut\.','splut',
'spotjockey\.','spotjockey',
'ukdirectory\.','ukdirectory',
'ukindex\.co\.uk','ukindex',
'ukplus\.','ukplus',
'searchy\.co\.uk','searchy',
# Minor finnish search engines
'haku\.www\.fi','haku',
# Minor french search engines
'recherche\.aol\.fr','aolfr',
'ctrouve\.','ctrouve',
'francite\.','francite',
'\.lbb\.org','lbb',
'rechercher\.libertysurf\.fr','libertysurf',
'search[\w\-]+\.free\.fr','free',
'recherche\.club-internet\.fr','clubinternet',
'toile\.com','toile',
'biglotron\.com', 'biglotron',
'mozbot\.fr', 'mozbot',
# Minor german search engines
'sucheaol\.aol\.de','aolde',
'fireball\.de','fireball',
'infoseek\.de','infoseek',
'suche\d?\.web\.de','webde',
'[a-z]serv\.rrzn\.uni-hannover\.de','meta',
'suchen\.abacho\.de','abacho',
'brisbane\.t-online\.de','t-online',
'allesklar\.de','allesklar',
'meinestadt\.de','meinestadt',
'212\.227\.33\.241','metaspinner',
'(161\.58\.227\.204|161\.58\.247\.101|212\.40\.165\.90|213\.133\.108\.202|217\.160\.108\.151|217\.160\.111\.99|217\.160\.131\.108|217\.160\.142\.227|217\.160\.176\.42)','metacrawler_de',
'wwweasel\.de','wwweasel',
'netluchs\.de','netluchs',
'schoenerbrausen\.de','schoenerbrausen',
# Minor Hungarian search engines
'heureka\.hu','heureka',
'vizsla\.origo\.hu','origo',
'lapkereso\.hu','lapkereso',
'goliat\.hu','goliat',
'index\.hu','indexhu',
'wahoo\.hu','wahoo',
'webmania\.hu','webmania',
'search\.internetto\.hu','internetto',
'tango\.hu','tango_hu',
'keresolap\.hu','keresolap_hu',
'polymeta\.hu','polymeta_hu',
# Minor Indian search engines
'sify\.com','sify',
# Minor Italian search engines
'virgilio\.it','virgilio',
'arianna\.libero\.it','arianna',
'supereva\.com','supereva',
'kataweb\.it','kataweb',
'search\.alice\.it\.master','aliceitmaster',
'search\.alice\.it','aliceit',
'gotuneed\.com','gotuneed',
'godado','godado',
'jumpy\.it','jumpy\.it',
'shinyseek\.it','shinyseek\.it',
'teecno\.it','teecnoit',
# Minor Japanese search engines
'ask\.jp','askjp',
'sagool\.jp','sagool',
# Minor Norwegian search engines
'sok\.start\.no','start', 'eniro\.no','eniro',
# Minor Polish search engines
'szukaj\.wp\.pl','wp',
'szukaj\.onet\.pl','onetpl',
'dodaj\.pl','dodajpl',
'gazeta\.pl','gazetapl',
'gery\.pl','gerypl',
'netsprint\.pl\/hoga\-search','hogapl',
'netsprint\.pl','netsprintpl',
'interia\.pl','interiapl',
'katalog\.onet\.pl','katalogonetpl',
'o2\.pl','o2pl',
'polska\.pl','polskapl',
'szukacz\.pl','szukaczpl',
'wow\.pl','wowpl',
# Minor russian search engines
'ya(ndex)?\.ru','yandex',
'aport\.ru','aport',
'rambler\.ru','rambler',
'turtle\.ru','turtle',
'metabot\.ru','metabot',
# Minor Swedish search engines
'evreka\.passagen\.se','passagen',
'eniro\.se','enirose',
# Minor Slovak search engines
'zoznam\.sk','zoznam',
# Minor Portuguese search engines
'sapo\.pt','sapo',
# Minor swiss search engines
'search\.ch','searchch',
'search\.bluewin\.ch','bluewin',
# Generic search engines
'search\..*\.\w+','search'
);


# SearchEnginesWithKeysNotInQuery
# List of search engines that store keyword as page instead of query parameter
#------------------------------------------------------------------------------
%SearchEnginesWithKeysNotInQuery=(
'a9',1    # www.a9.com/searckey1%20searchkey2
);

# SearchEnginesKnownUrl
# Known rules to extract keywords from a referrer search engine URL
#------------------------------------------------------------------------------
%SearchEnginesKnownUrl=(
# Most common search engines
'alexa','q=',
'alltheweb','q(|uery)=',
'altavista','q=',
'a9','a9\.com\/', 
'dmoz','search=',
'google_base','(p|q|as_p|as_q)=',
'google_froogle','(p|q|as_p|as_q)=',
'google_groups','group\/', # does not work
'google_image','(p|q|as_p|as_q)=',
'google_cache','(p|q|as_p|as_q)=cache:[0-9A-Za-z]{12}:',
'google','(p|q|as_p|as_q)=',
'lycos','query=',
'msn','q=',
'live','q=',
'netscape','search=',
'tiscali','key=',
'aol','query=',
'terra','query=',
'voila','(kw|rdata)=',
'search.com','q=',
'yahoo_mindset','p=',
'yahoo','p=',
'sympatico', 'query=', 
'excite','search=',
# Minor international search engines
'google4counter','(p|q|as_p|as_q)=',
'att','qry=',
'bungeebonesdotcom','query=',
'go','qt=',
'askde','(ask|q)=', # break out Ask country specific engines.
'askes','(ask|q)=',
'askfr','(ask|q)=',
'askit','(ask|q)=',
'asknl','(ask|q)=',
'ask','(ask|q)=',
'atomz','sp-q=',
'euroseek','query=',
'findarticles','key=',
'go2net','general=',
'hotbot','mt=',
'infospace','qkw=',
'kvasir', 'q=',
'looksmart','key=',
'mamma','query=',
'metacrawler','general=',
'nbci','keyword=',
'northernlight','qr=',
'overture','keywords=',
'dogpile', 'q(|kw)=',
'spray','string=',
'teoma','q=',
'webcrawler','searchText=',
'wisenut','query=', 
'ixquick', 'query=',
'earthlink', 'q=',
'iune','(keywords|q)=',
'blingo','q=',
'centraldatabase','query=',
'clusty','query=',
'mysearch','searchfor=',
'vivisimo','query=',
# kartoo: No keywords passed in referring URL.
'kartoo','',
'icerocket','q=',
'sphere','q=',
'ledix','q=',
'shawca','q=',
'searchalot','q=',
'copernic','web\/',
'avantfind','keywords=',
'steadysearch','w=',
# Chello Portals
'chelloat','q1=',
'chellobe','q1=',
'chellocz','q1=',
'chellofr','q1=',
'chellohu','q1=',
'chellonl','q1=',
'chellono','q1=',
'chellopl','q1=',
'chellose','q1=',
'chellosk','q1=',
'chellocom','q1=',
# Mirago
'miragobe','(txtsearch|qry)=',
'miragoch','(txtsearch|qry)=',
'miragode','(txtsearch|qry)=',
'miragodk','(txtsearch|qry)=',
'miragoes','(txtsearch|qry)=',
'miragofr','(txtsearch|qry)=',
'miragoit','(txtsearch|qry)=',
'miragonl','(txtsearch|qry)=',
'miragono','(txtsearch|qry)=',
'miragose','(txtsearch|qry)=',
'miragocouk','(txtsearch|qry)=',
'mirago','(txtsearch|qry)=',
'answerbus','', # Does not provide query parameters
'icq','q=',
'nusearch','nusearch_terms=',
'goodsearch','Keywords=',
'scroogle','Gw=', # Does not always provide query parameters
'questionanswering','',
'mywebsearch','searchfor=',
'comettoolbar','qry=',
# Social Bookmarking Services
'delicious','all=',
'digg','s=',
'stumbleupon','',
'swik','swik\.net/', # does not work. Keywords follow domain, e.g. http://swik.net/awstats+analytics
'segnalo','',
'ineffabile','',
# Minor Australian search engines
'anzwers','search=',
# Minor brazilian search engines
'engine','p1=', 'miner','q=',
# Minor chinese search engines
'baidu','(wd|word)=',
'iask','(w|k)=',
'accoona','qt=',
'3721','(p|name)=',
'netease','q=',
'soso','q=',
'zhongsou','(word|w)=',
'sogou', 'query=',
'vnet','kw=',
# Minor czech search engines
'atlas','searchtext=', 'seznam','w=', 'quick','query=', 'centrum','q=', 'jyxo','s=', 'najdi','dotaz=', 'redbox','srch=',
# Minor danish search engines
'opasia','q=', 'danielsen','q=', 'sol','q=', 'jubii','soegeord=', 'finddk','words=', 'edderkoppen','query=', 'orbis','search_field=', '1klik','query=', 'ofir','querytext=',
# Minor dutch search engines
'ilse','search_for=', 'vindex','in=',
# Minor english search engines
'askuk','(ask|q)=', 'bbc','q=', 'freeserve','q=', 'looksmartuk','key=',
'splut','pattern=', 'spotjockey','Search_Keyword=', 'ukindex', 'stext=', 'ukdirectory','k=', 'ukplus','search=', 'searchy', 'search_term=',
# Minor finnish search engines
'haku','w=',
# Minor french search engines
'francite','name=', 'clubinternet', 'q=',
'toile', 'q=',
'biglotron','question=',
'mozbot','q=',
# Minor german search engines
'aolde','q=',
'fireball','q=', 'infoseek','qt=', 'webde','su=',
'abacho','q=', 't-online','q=', 
'metaspinner','qry=',
'metacrawler_de','qry=',
'wwweasel','q=',
'netluchs','query=',
'schoenerbrausen','q=',
# Minor Hungarian search engines
'heureka','heureka=', 'origo','(q|search)=', 'goliat','KERESES=', 'wahoo','q=', 'internetto','searchstr=',
'keresolap_hu','q=',
'tango_hu','q=',
'polymeta_hu','',
# Minor Indian search engines
'sify','keyword=',
# Minor Italian search engines
'virgilio','qs=',
'arianna','query=',
'supereva','q=',
'kataweb','q=',
'aliceitmaster','qs=',
'aliceit','qs=',
'gotuneed','', # Not yet known
'godado','Keywords=',
'jumpy\.it','searchWord=',
'shinyseek\.it','KEY=',
'teecnoit','q=',
# Minor Japanese search engines
'askjp','(ask|q)=',
'sagool','q=',
# Minor Norwegian search engines
'start','q=', 'eniro','q=',
# Minor Polish search engines
'wp','szukaj=',
'onetpl','qt=',
'dodajpl','keyword=',
'gazetapl','slowo=',
'gerypl','q=',
'hogapl','qt=',
'netsprintpl','q=',
'interiapl','q=',
'katalogonetpl','qt=',
'o2pl','qt=',
'polskapl','qt=',
'szukaczpl','q=',
'wowpl','q=',
# Minor russian search engines
'yandex', 'text=', 'rambler','words=', 'aport', 'r=', 'metabot', 'st=',
# Minor swedish search engines
'passagen','q=',
'enirose','q=',
# Minor swiss search engines
'searchch', 'q=', 'bluewin', 'qry='
);

# SearchEnginesKnownUrlNotFound
# Known rules to extract not found keywords from a referrer search engine URL
#------------------------------------------------------------------------------
%SearchEnginesKnownUrlNotFound=(
# Most common search engines
'msn','origq='
);

# If no rules are known, WordsToExtractSearchUrl will be used to search keyword parameter
# If no rules are known and search in WordsToExtractSearchUrl failed, this will be used to clean URL of not keyword parameters.
#------------------------------------------------------------------------------
@WordsToExtractSearchUrl= ('tn=','ie=','ask=','claus=','general=','key=','kw=','keyword=','keywords=','MT=','p=','q=','qr=','qt=','query=','s=','search=','searchText=','string=','su=','txtsearch=','w=');
@WordsToCleanSearchUrl= ('act=','annuaire=','btng=','cat=','categoria=','cfg=','cof=','cou=','count=','cp=','dd=','domain=','dt=','dw=','enc=','exec=','geo=','hc=','height=','hits=','hl=','hq=','hs=','id=','kl=','lang=','loc=','lr=','matchmode=','medor=','message=','meta=','mode=','order=','page=','par=','pays=','pg=','pos=','prg=','qc=','refer=','sa=','safe=','sc=','sort=','src=','start=','style=','stype=','sum=','tag=','temp=','theme=','type=','url=','user=','width=','what=','\\.x=','\\.y=','y=','look=');

# SearchEnginesKnownUTFCoding
# Known parameter that proves a search engine has coded its parameters in UTF-8
#------------------------------------------------------------------------------
%SearchEnginesKnownUTFCoding=(
# Most common search engines
'google','ie=utf-8',
'alltheweb','cs=utf-8'
);


# SearchEnginesHashLib
# List of search engines names
# 'search_engine_id', 'search_engine_name',
#------------------------------------------------------------------------------
%SearchEnginesHashLib=(
# Major international search engines
'alexa','<a href="http://www.alexa.com/" title="Search Engine Home Page [new window]" target="_blank">Alexa</a>',
'alltheweb','<a href="http://www.alltheweb.com/" title="Search Engine Home Page [new window]" target="_blank">AllTheWeb</a>',
'altavista','<a href="http://www.altavista.com/" title="Search Engine Home Page [new window]" target="_blank">AltaVista</a>',
'a9', '<a href="http://www.a9.com/" title="Search Engine Home Page [new window]" target="_blank">A9</a>',
'dmoz','<a href="http://dmoz.org/" title="Search Engine Home Page [new window]" target="_blank">DMOZ</a>',
'google_base','<a href="http://base.google.com/" title="Search Engine Home Page [new window]" target="_blank">Google (Base)</a>',
'google_froogle','<a href="http://froogle.google.com/" title="Search Engine Home Page [new window]" target="_blank">Froogle (Google)</a>',
'google_groups','<a href="http://groups.google.com/" title="Search Engine Home Page [new window]" target="_blank">Google (Groups)</a>',
'google_image','<a href="http://images.google.com/" title="Search Engine Home Page [new window]" target="_blank">Google (Images)</a>',
'google_cache','<a href="http://www.google.com/help/features.html#cached" title="Search Engine Home Page [new window]" target="_blank">Google (cache)</a>',
'google','<a href="http://www.google.com/" title="Search Engine Home Page [new window]" target="_blank">Google</a>',
'lycos','<a href="http://www.lycos.com/" title="Search Engine Home Page [new window]" target="_blank">Lycos</a>',
'msn','<a href="http://search.msn.com/" title="Search Engine Home Page [new window]" target="_blank">MSN Search</a>',
'live','<a href="http://www.live.com/" title="Search Engine Home Page [new window]" target="_blank">Windows Live</a>',
'netscape','<a href="http://www.netscape.com/" title="Search Engine Home Page [new window]" target="_blank">Netscape</a>',
'aol','<a href="http://www.aol.com/" title="Search Engine Home Page [new window]" target="_blank">AOL</a>',
'terra','<a href="http://www.terra.es/" title="Search Engine Home Page [new window]" target="_blank">Terra</a>',
'tiscali','<a href="http://search.tiscali.com/" title="Search Engine Home Page [new window]" target="_blank">Tiscali</a>',
'voila','<a href="http://www.voila.fr/" title="Search Engine Home Page [new window]" target="_blank">Voila</a>',
'search.com','<a href="http://www.search.com/" title="Search Engine Home Page [new window]" target="_blank">Search.com</a>',
'yahoo_mindset','<a href="http://mindset.research.yahoo.com/" title="Search Engine Home Page [new window]" target="_blank">Yahoo! Mindset</a>',
'yahoo','<a href="http://www.yahoo.com/" title="Search Engine Home Page [new window]" target="_blank">Yahoo!</a>',
'sympatico','<a href="http://sympatico.msn.ca/" title="Search Engine Home Page [new window]" target="_blank">Sympatico</a>',
'excite','<a href="http://www.excite.com/" title="Search Engine Home Page [new window]" target="_blank">Excite</a>',
# Minor international search engines
'google4counter','<a href="http://www.4-counter.com/" title="Search Engine Home Page [new window]" target="_blank">4-counter (Google)</a>',
'att','<a href="http://www.att.net/" title="Search Engine Home Page [new window]" target="_blank">AT&T search (powered by Google)</a>',
'bungeebonesdotcom','<a href="http://BungeeBones.com/search.php/" title="Search Engine Home Page [new window]" target="_blank">BungeeBones</a>',
'go','Go.com',
'askde','<a href="http://de.ask.com/" title="Search Engine Home Page [new window]" target="_blank">Ask Deutschland</a>',
'askes','<a href="http://es.ask.com/" title="Search Engine Home Page [new window]" target="_blank">Ask Espa&ntilde;a</a>', # break out Ask country specific engines.
'askfr','<a href="http://fr.ask.com/" title="Search Engine Home Page [new window]" target="_blank">Ask France</a>',
'askit','<a href="http://it.ask.com/" title="Search Engine Home Page [new window]" target="_blank">Ask Italia</a>',
'asknl','<a href="http://nl.ask.com/" title="Search Engine Home Page [new window]" target="_blank">Ask Nederland</a>',
'ask','<a href="http://www.ask.com/" title="Search Engine Home Page [new window]" target="_blank">Ask</a>',
'atomz','Atomz',
'dejanews','DejaNews',
'euroseek','Euroseek',
'findarticles','Find Articles',
'go2net','Go2Net (Metamoteur)',
'hotbot','Hotbot',
'infospace','InfoSpace',
'kvasir','Kvasir',
'looksmart','Looksmart',
'mamma','Mamma',
'metacrawler','MetaCrawler (Metamoteur)',
'nbci','NBCI',
'northernlight','NorthernLight',
'overture','Overture',                 # Replace 'goto\.com','Goto.com',
'dogpile','<a href="http://www.dogpile.com/" title="Search Engine Home Page [new window]" target="_blank">Dogpile</a>',
'spray','Spray',
'teoma','<a href="http://search.ask.com/" title="Search Engine Home Page [new window]" target="_blank">Teoma</a>',							# Replace 'directhit\.com','DirectHit',
'webcrawler','<a href="http://www.webcrawler.com/" title="Search Engine Home Page [new window]" target="_blank">WebCrawler</a>',
'wisenut','WISENut', 
'ixquick','<a href="http://www.ixquick.com/" title="Search Engine Home Page [new window]" target="_blank">ix quick</a>', 
'earthlink', 'Earth Link',
'iune','<a href="http://www.i-une.com/" title="Search Engine Home Page [new window]" target="_blank">i-une</a>',
'blingo','<a href="http://www.blingo.com/" title="Search Engine Home Page [new window]" target="_blank">Blingo</a>',
'centraldatabase','<a href="http://search.centraldatabase.org/" title="Search Engine Home Page [new window]" target="_blank">GPU p2p search</a>',
'clusty','<a href="http://www.clusty.com/" title="Search Engine Home Page [new window]" target="_blank">Clusty</a>',
'mysearch','<a href="http://www.mysearch.com" title="Search Engine Home Page [new window]" target="_blank">My Search</a>',
'vivisimo','<a href="http://www.vivisimo.com/" title="Search Engine Home Page [new window]" target="_blank">Vivisimo</a>',
'kartoo','<a href="http://www.kartoo.com/" title="Search Engine Home Page [new window]" target="_blank">Kartoo</a>',
'icerocket','<a href="http://www.icerocket.com/" title="Search Engine Home Page [new window]" target="_blank">Icerocket (Blog)</a>',
'sphere','<a href="http://www.sphere.com/" title="Search Engine Home Page [new window]" target="_blank">Sphere (Blog)</a>',
'ledix','<a href="http://www.ledix.net/" title="Search Engine Home Page [new window]" target="_blank">Ledix</a>',
'shawca','<a href="http://start.shaw.ca/" title="Search Engine Home Page [new window]" target="_blank">Shaw.ca</a>',
'searchalot','<a href="http://www.searchalot.com/" title="Search Engine Home Page [new window]" target="_blank">Searchalot</a>',
'copernic','<a href="http://www.copernic.com/" title="Search Engine Home Page [new window]" target="_blank">Copernic</a>',
'avantfind','<a href="http://www.avantfind.com/" title="Search Engine Home Page [new window]" target="_blank">Avantfind</a>',
'steadysearch','<a href="http://www.avantfind.com/" title="Search Engine Home Page [new window]" target="_blank">Avantfind</a>',
# Chello Portals
'chelloat','<a href="http://www.chello.at/" title="Search Engine Home Page [new window]" target="_blank">Chello Austria</a>',
'chellobe','<a href="http://www.chello.be/" title="Search Engine Home Page [new window]" target="_blank">Chello Belgium</a>',
'chellocz','<a href="http://www.chello.cz/" title="Search Engine Home Page [new window]" target="_blank">Chello Czech Republic</a>',
'chellofr','<a href="http://www.chello.fr/" title="Search Engine Home Page [new window]" target="_blank">Chello France</a>',
'chellohu','<a href="http://www.chello.hu/" title="Search Engine Home Page [new window]" target="_blank">Chello Hungary</a>',
'chellonl','<a href="http://www.chello.nl/" title="Search Engine Home Page [new window]" target="_blank">Chello Netherlands</a>',
'chellono','<a href="http://www.chello.no/" title="Search Engine Home Page [new window]" target="_blank">Chello Norway</a>',
'chellopl','<a href="http://www.chello.pl/" title="Search Engine Home Page [new window]" target="_blank">Chello Poland</a>',
'chellose','<a href="http://www.chello.se/" title="Search Engine Home Page [new window]" target="_blank">Chello Sweden</a>',
'chellosk','<a href="http://www.chello.sk/" title="Search Engine Home Page [new window]" target="_blank">Chello Slovakia</a>',
'chellocom','<a href="http://www.chello.com/" title="Search Engine Home Page [new window]" target="_blank">Chello (Country not recognized)</a>',
# Mirago
'miragobe','<a href="http://www.mirago.be/" title="Search Engine Home Page [new window]" target="_blank">Mirago Belgium</a>',
'miragoch','<a href="http://www.mirago.ch/" title="Search Engine Home Page [new window]" target="_blank">Mirago Switzerland</a>',
'miragode','<a href="http://www.mirago.de/" title="Search Engine Home Page [new window]" target="_blank">Mirago Germany</a>',
'miragodk','<a href="http://www.mirago.dk/" title="Search Engine Home Page [new window]" target="_blank">Mirago Denmark</a>',
'miragoes','<a href="http://es.mirago.com/" title="Search Engine Home Page [new window]" target="_blank">Mirago Spain</a>',
'miragofr','<a href="http://www.mirago.fr/" title="Search Engine Home Page [new window]" target="_blank">Mirago France</a>',
'miragoit','<a href="http://www.mirago.it/" title="Search Engine Home Page [new window]" target="_blank">Mirago Italy</a>',
'miragonl','<a href="http://www.mirago.nl/" title="Search Engine Home Page [new window]" target="_blank">Mirago Netherlands</a>',
'miragono','<a href="http://no.mirago.com/" title="Search Engine Home Page [new window]" target="_blank">Mirago Norway</a>',
'miragose','<a href="http://www.mirago.se/" title="Search Engine Home Page [new window]" target="_blank">Mirago Sweden</a>',
'miragocouk','<a href="http://zone.mirago.co.uk/" title="Search Engine Home Page [new window]" target="_blank">Mirago UK</a>',
'mirago','<a href="http://www.mirago.com/" title="Search Engine Home Page [new window]" target="_blank">Mirago (country unknown)</a>',
'answerbus','<a href="http://www.answerbus.com/" title="Search Engine Home Page [new window]" target="_blank">Answerbus</a>',
'icq','<a href="http://www.icq.com/" title="Search Engine Home Page [new window]" target="_blank">icq</a>',
'nusearch','<a href="http://www.nusearch.com/" title="Search Engine Home Page [new window]" target="_blank">Nusearch</a>',
'goodsearch','<a href="http://www.goodsearch.com/" title="Search Engine Home Page [new window]" target="_blank">GoodSearch</a>',
'scroogle','<a href="http://www.scroogle.org/" title="Search Engine Home Page [new window]" target="_blank">Scroogle</a>',
'questionanswering','<a href="http://www.questionanswering.com/" title="Questionanswering home page [new window]" target="_blank">Questionanswering</a>',
'mywebsearch','<a href="http://search.mywebsearch.com/" title="MyWebSearch home page [new window]" target="_blank">MyWebSearch</a>',
'comettoolbar','<a href="http://as.starware.com/dp/search" title="Comet toolbar search home page [new window]" target="_blank">Comet toolbar search</a>',
# Social Bookmarking Services
'delicious','<a href="http://del.icio.us/" title="del.icio.us home page [new window]" target="_blank">del.icio.us</a> (Social Bookmark)',
'digg','<a href="http://www.digg.com/" title="Digg home page [new window]" target="_blank">Digg</a> (Social Bookmark)',
'stumbleupon','<a href="http://www.stumbleupon.com/" title="Stumbleupon home page [new window]" target="_blank">Stumbleupon</a> (Social Bookmark)',
'swik','<a href="http://swik.net/" title="Swik home page [new window]" target="_blank">Swik</a> (Social Bookmark)',
'segnalo','<a href="http://segnalo.alice.it/" title="Segnalo home page [new window]" target="_blank">Segnalo</a> (Social Bookmark)',
'ineffabile','<a href="http://www.ineffabile.it/" title="Ineffabile.it home page [new window]" target="_blank">Ineffabile.it</a> (Social Bookmark)',
# Minor Australian search engines
'anzwers','<a href="http://anzwers.com.au/" title="anzwers.com.au home page [new window]" target="_blank">anzwers.com.au</a>',
# Minor brazilian search engines
'engine','Cade', 'miner','Meta Miner',
# Minor chinese search engines
'baidu','<a href="http://www.baidu.com/" target="_blank">Baidu</a>',
'iask','<a href="http://www.iask.com/" target="_blank">Iask</a>',
'accoona','<a href="http://cn.accoona.com">Accoona</a>',
'3721','<a href="http://www.3721.com/" target="_blank">3721</a>',
'netease', '<a href="http://www.163.com/" target="_blank">NetEase</a>',
'soso','<a href="http://www.soso.com/" target="_blank">SoSo</a>',
'zhongsou','<a href="http://www.zhongsou.com/" target="_blank">ZhongSou</a>',
'sogou', '<a href="http://www.sogou.com/" target="_blank">SoGou</a>',
'vnet','<a href="http://114.vnet.cn/" target="_blank">VNet</a>',
# Minor czech search engines
'atlas','Atlas.cz',	'seznam','Seznam', 'quick','Quick.cz', 'centrum','Centrum.cz', 'jyxo','Jyxo.cz', 'najdi','Najdi.to', 'redbox','RedBox.cz',
# Minor danish search-engines
'opasia','Opasia', 'danielsen','Thor (danielsen.com)', 'sol','SOL', 'jubii','Jubii', 'finddk','Find', 'edderkoppen','Edderkoppen', 'netstjernen','Netstjernen', 'orbis','Orbis', 'tyfon','Tyfon', '1klik','1Klik', 'ofir','Ofir',
# Minor dutch search engines
'ilse','Ilse','vindex','Vindex\.nl',						
# Minor english search engines
'askuk','<a href="http://uk.ask.com/" title="Search Engine Home Page [new window]" target="_blank">Ask UK</a>',
'bbc','BBC', 'freeserve','Freeserve', 'looksmartuk','Looksmart UK',
'splut','Splut', 'spotjockey','Spotjockey', 'ukdirectory','UK Directory', 'ukindex','UKIndex', 'ukplus','UK Plus', 'searchy','searchy.co.uk',
# Minor finnish search engines
'haku','Ihmemaa',										
# Minor french search engines
'aolfr','AOL (fr)', 'ctrouve','C\'est trouv�', 'francite','Francit�', 'lbb', 'LBB', 'libertysurf', 'Libertysurf', 'free', 'Free.fr', 'clubinternet', 'Club-internet',
'toile', 'Toile du Qu�bec',
'biglotron','<a href="http://www.biglotron.com/" title="Search Engine Home Page [new window]" target="_blank">Biglotron</a>',
'mozbot','<a href="http://www.mozbot.fr/" title="Search Engine Home Page [new window]" target="_blank">Mozbot</a>',
# Minor German search engines
'aolde','AOL (de)',
'fireball','Fireball', 'infoseek','Infoseek', 'webde','Web.de',
'abacho','Abacho', 't-online','T-Online', 
'allesklar','allesklar.de', 'meinestadt','meinestadt.de', 
'metaspinner','metaspinner',
'metacrawler_de','metacrawler.de',
'wwweasel','<a href="http://wwweasel.de/" title="Search Engine Home Page [new window]" target="_blank">WWWeasel</a>',
'netluchs','<a href="http://www.netluchs.de/" title="Search Engine Home Page [new window]" target="_blank">Netluchs</a>',
'schoenerbrausen','<a href="http://www.schoenerbrausen.de/" title="Search Engine Home Page [new window]" target="_blank">Schoenerbrausen/</a>',
# Minor hungarian search engines
'heureka','Heureka', 'origo','Origo-Vizsla', 'lapkereso','Startlapkeres�', 'goliat','G�li�t', 'indexhu','Index', 'wahoo','Wahoo', 'webmania','webmania.hu', 'internetto','Internetto Keres�',
'tango_hu','<a href="http://tango.hu/" title="Search Engine Home Page [new window]" target="_blank">Tango</a>',
'keresolap_hu','<a href="http://keresolap.hu/" title="Search Engine Home Page [new window]" target="_blank">Tango keresolap</a>',
'polymeta_hu','<a href="http://www.polymeta.hu/" title="Search Engine Home Page [new window]" target="_blank">Polymeta</a>',
# Minor Indian search engines
'sify','<a href="http://search.sify.com/" title="Search Engine Home Page [new window]" target="_blank">Sify</a>',
# Minor Italian search engines
'virgilio','<a href="http://www.virgilio.it/" title="Search Engine Home Page [new window]" target="_blank">Virgilio</a>',
'arianna','<a href="http://arianna.libero.it/" title="Search Engine Home Page [new window]" target="_blank">Arianna</a>',
'supereva','<a href="http://search.supereva.com/" title="Search Engine Home Page [new window]" target="_blank">Supereva</a>',
'kataweb','<a href="http://www.kataweb.it/ricerca/" title="Search Engine Home Page [new window]" target="_blank">Kataweb</a>',
'aliceitmaster','<a href="http://www.alice.it/" title="Search Engine Home Page [new window]" target="_blank">search.alice.it.master</a>',
'aliceit','<a href="http://www.alice.it/" title="Search Engine Home Page [new window]" target="_blank">alice.it</a>',
'gotuneed','<a href="http://www.gotuneed.com/" title="Search Engine Home Page [new window]" target="_blank">got u need</a>',
'godado','Godado.it',
'jumpy\.it','Jumpy.it',
'shinyseek\.it','Shinyseek.it',
'teecnoit','<a href="http://www.teecno.it/" title="Teecno home page [new window]" target="_blank">Teecno</a>',
# Minor Japanese search engines
'askjp','<a href="http://www.ask.jp/" title="Search E@SearchEngngine Home Page [new window]" target="_blank">Ask Japan</a>',
'sagool','<a href="http://sagool.jp/" title="Sagool home page [new window]" target="_blank">Sagool</a>',
# Minor Norwegian search engines
'start','start.no', 'eniro','<a href="http://www.eniro.no/" title="Search Engine Home Page [new window]" target="_blank">Eniro</a>',	
# Minor polish search engines
'wp','<a href="http://szukaj.wp.pl/" title="Wirtualna Polska home page [new window]" target="_blank">Wirtualna Polska</a>',
'onetpl','<a href="http://szukaj.onet.pl/" title="Onet.pl home page [new window]" target="_blank">Onet.pl</a>',
'dodajpl','<a href="http://www.dodaj.pl/" title="Dodaj.pl home page [new window]" target="_blank">Dodaj.pl</a>',
'gazetapl','<a href="http://szukaj.gazeta.pl/" title="Gazeta.pl home page [new window]" target="_blank">Gazeta.pl</a>',
'gerypl','<a href="http://szukaj.gery.pl/" title="Gery.pl home page [new window]" target="_blank">Gery.pl</a>',
'hogapl','<a href="http://www.hoga.pl/" title="Hoga.pl home page [new window]" target="_blank">Hoga.pl</a>',
'netsprintpl','<a href="http://www.netsprint.pl/" title="NetSprint.pl home page [new window]" target="_blank">NetSprint.pl</a>',
'interiapl','<a href="http://www.google.interia.pl/" title="Interia.pl home page [new window]" target="_blank">Interia.pl</a>',
'katalogonetpl','<a href="http://katalog.onet.pl/" ti@SearchEngtle="Katalog.Onet.pl home page [new window]" target="_blank">Katalog.Onet.pl</a>',
'o2pl','<a href="http://szukaj2.o2.pl/" title="o2.pl home page [new window]" target="_blank">o2.pl</a>',
'polskapl','<a href="http://szukaj.polska.pl/" title="Polska home page [new window]" target="_blank">Polska</a>',
'szukaczpl','<a href="http://www.szukacz.pl/" title="Szukacz home page [new window]" target="_blank">Szukacz</a>',
'wowpl','<a href="http://szukaj.wow.pl/" title="Wow.pl home page [new window]" target="_blank">Wow.pl</a>',
# Minor russian search engines
'yandex', 'Yandex', 'aport', 'Aport', 'rambler', 'Rambler', 'turtle', 'Turtle', 'metabot', 'MetaBot',
# Minor Swedish search engines
'passagen','Evreka',
'enirose','<a href="http://www.eniro.se/" title="Eniro Sverige home page [new window]" target="_blank">Eniro Sverige</a>',
# Minor Slovak search engines
'zoznam','<a href="http://www.zoznam.sk/" title="Zoznam search engine home page [new window]" target="_blank">Zoznam</a>',
# Minor Portuguese search engines
'sapo','<a href="http://www.sapo.pt/" title="Sapo search engine home page [new window]" target="_blank">Sapo</a>',
# Minor Swiss search engines
'searchch', 'search.ch', 'bluewin', 'search.bluewin.ch',								
# Generic search engines
'search','Unknown search engines'
);


# Sanity check.
# Enable this code and run perl search_engines.pm to check file entries are ok
#-----------------------------------------------------------------------------
#foreach my $key (@SearchEnginesSearchIDOrder_list1) {
#	if (! $SearchEnginesHashID{$key}) { error("Entry '$key' has been found in SearchEnginesSearchIDOrder_list1 with no value in SearchEnginesHashID");
#	foreach my $key2 (@SearchEnginesSearchIDOrder_list2) { if ($key2 eq $key) { error("$key is in 1 and 2\n"); } }
#	foreach my $key2 (@SearchEnginesSearchIDOrder_listgen) { if ($key2 eq $key) { error("$key is in 1 and gen\n"); } }
#} }
#foreach my $key (@SearchEnginesSearchIDOrder_list2) {
#	if (! $SearchEnginesHashID{$key}) { error("Entry '$key' has been found in SearchEnginesSearchIDOrder_list1 with no value in SearchEnginesHashID");
#	foreach my $key2 (@SearchEnginesSearchIDOrder_list1) { if ($key2 eq $key) { error("$key is in 2 and 1\n"); } }
#	foreach my $key2 (@SearchEnginesSearchIDOrder_listgen) { if ($key2 eq $key) { error("$key is in 2 and gen\n"); } }
#} }
#foreach my $key (@SearchEnginesSearchIDOrder_listgen) { if (! $SearchEnginesHashID{$key}) { error("Entry '$key' has been found in SearchEnginesSearchIDOrder_listgen with no value in SearchEnginesHashID"); } }
#foreach my $key (keys %NotSearchEnginesKeys) { if (! $SearchEnginesHashID{$key}) { error("Entry '$key' has been found in NotSearchEnginesKeys with no value in SearchEnginesHashID"); } }
#foreach my $key (keys %SearchEnginesKnownUrl) {
#	my $found=0;
#	foreach my $key2 (values %SearchEnginesHashID) {
#		if ($key eq $key2) { $found=1; last; }
#	}
#	if (! $found) { die "Entry '$key' has been found in SearchEnginesKnownUrl with no value in SearchEnginesHashID"; }
#}
#foreach my $key (keys %SearchEnginesHashLib) {
#	my $found=0;
#	foreach my $key2 (values %SearchEnginesHashID) {
#		if ($key eq $key2) { $found=1; last; }
#	}
#	if (! $found) { die "Entry '$key' has been found in SearchEnginesHashLib with no value in SearchEnginesHashID"; }
#}
#print @SearchEnginesSearchIDOrder_list1." ".@SearchEnginesSearchIDOrder_list2." ".@SearchEnginesSearchIDOrder_listgen;

1;
