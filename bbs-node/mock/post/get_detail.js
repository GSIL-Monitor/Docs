/**
 * @overview
 * @author cisong
 * @date 6/3/16
 */

const fs = require('fs');
const path = require('path');

module.exports = function (req) {
    const tid = parseInt(req.body.tid, 10);
    const message = fs.readFileSync(path.join(__dirname, 'post.txt'), 'utf8');

    return {
        "code": 0,
        "data": {
            "author": {
                "headImgUrl": "http://avatar.wacdn.com/static/image/noavatar.gif?imageView2/1/w/120/h/120",
                "homePageUrl": "http://bbs.wacaiyun.com/m/profile?uid=49&popup=1&need_zinfo=1",
                "nickName": "banker",
                "uid": 49,
                "wcUid": 299504915
            },
            "follow": false,
            "self" : true,
            "fav" : true,
            "like" : false,
            "post": {
                "replies":10,
                "fid": 16058,
                message: '<br><div align="center"><a class="js-view-large" data-img="//bbsimg.wacdn.com/forum/201701/24/1133005620c471ef6a4bfb.jpg" href="javascript:void(0)"><img data-src="//bbsimg.wacdn.com/forum/201701/24/1133005620c471ef6a4bfb.jpg" class="lazy"></a></div><br><div align="left"><div align="left"><font><font>去年4月份，央行发布《关于信用卡业务有关事项的通知》，《通知》将于2017年1月1日起实施。根据《通知》内容，银行在信用卡收费标准方面的规定主要有以下几点变化：</font></font></div><br><div align="left"><font><font>1、“取消信用卡滞纳金，对于持卡人违约逾期未还款的行为，发卡机构应与持卡人通过协议约定是否收取违约金，以及相关收取方式和标准”；</font></font></div><br><div align="left"><font><font>2、“不得收取超限费”；</font></font></div><br><div align="left"><font><font>3、“发卡机构对向持卡人收取的违约金和年费、取现手续费、货币兑换费等服务费用不得计收利息”；</font></font></div><br><div align="left"><font><font>4、“对信用卡透支利率实行上限和下限管理，透支利率上限为日利率万分之五，透支利率下限为日利率万分之五的0.7倍”；</font></font></div><br><div align="left"><font><font>5、“持卡人透支消费享受免息还款期和最低还款额待遇的条件和标准等，由发卡机构自主确定”；等等。</font></font></div><br><div align="left"><font><font>逐条分析，石榴君有以下看法：</font></font></div><br><div align="left"><font><font>1、滞纳金改违约金</font></font></div><br><div align="left"><font><font>截止目前，不少银行已经取消了信用卡滞纳金，改为对逾期部分收取违约金，违约金一般也是最低还款额未还部分的5%，有些银行设置了征收上下限。</font></font></div><br><div align="left"><font><font>虽然没有完全取消对逾期还款的罚款收费，但是从“滞纳金”到“违约金”，不仅仅是名称的变化，不少银行对违约金设置了征收上限，同时违约金不再像滞纳金一样纳入到复利的本金范围，也就是说违约金一次性收取，不再每月利滚利。这一调整既不失对持卡人的约束作用，同时也在一定程度上减轻了持卡人的负担。</font></font></div><br><div align="left"><font><font>2、取消超限费</font></font></div><br><div align="left"><font><font>之前，多数银行会对超限刷卡征收一定的超限手续费，一般为超限金额的5%，目前大部分银行已经公告取消了超限费，不再收取超限费，银行将控制持卡人超限刷卡的权限与功能，持卡人将无法超限刷卡，或者超限刷卡的限额会变小。</font></font></div><br><div align="left"><font><font>3、透支利率调整</font></font></div><br><div align="left"><font><font>截止目前，各家银行的信用卡透支利息仍然是每日万分之五，未做具体调整，但不少银行已发公告，2017年1月1日起，信用卡透支利息征收标准改为“日利率0.035%至0.05%”。也就是说未来利息的收取更灵活了，银行可以将利息控制在一定的区间，可能会“因人而异”、“因卡而异”。</font></font></div><br><div align="left"><font><font>4、免息还款期和最低还款额由银行自主确定</font></font></div><br><div align="left"><font><font>目前还没有一家银行发布相关的调整公告，当前最低还款额都是10%，免息期略有不同，最长的是工行、农行、交行等几家银行，均为56天。因此如果要调整的话，可能是先调免息期，免息期50天的银行有望延长。</font></font></div><br><div align="left"><font><font><font color="#3e3e3e">顺带说下有关银行账户的新规，事关“钱袋子”，还是很重要的！</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">去年12月25日，央行发布一则《关于改进个人银行账户服务加强账户管理的通知》，第一次提出对银行账户实施分级管理机制。</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">今年9月30日，央行发布《关于加强支付结算管理防范电信网络新型违法犯罪有关事项的通知》，要求全面推进个人账户分类管理，从2016年12月1日起，同一个人在同一家银行只能开立一个Ⅰ类户，已开立Ⅰ类户，再新开户的，应当开立Ⅱ类户或Ⅲ类户。</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">11月25日，央行再发《关于落实个人银行账户分类管理制度的通知》，重申关于银行个人账户分类管理的相关要求。</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">新规马上就要落地了，事关钱袋子，快来看看你的银行账户将发生哪些变化？</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">总的来看，下月将实行的银行新规包括以下几项：</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">1、银行账户实行Ⅰ、Ⅱ、Ⅲ类分类管理（有关银行账户分类管理，后面会着重展开介绍）。</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">2、同行异地存取款、转账手续费取消。</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">央行规定，银行对本银行内异地存取款、转账等业务，收取异地手续费的，应当自9月30日起三个月内实现免费。</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">石榴君看法：以后办理同行存取款及转账业务免费了，但是跨行办理以上业务还是要收费的，建议通过手机银行，大多数手机银行跨行转账汇款免手续费。另外，各家银行具体执行的时间不一，请大家留意开户银行的公告，如招行就规定，12月31日起才正式实施免收行内异地存取现、转账汇款、异地领卡及异地移存等费用。</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">3、ATM机转账24小时内将可撤销</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">自12月1日起，银行和支付机构提供转账服务时应当执行下列规定，向存款人提供实时到账、普通到账、次日到账等多种转账方式选择，存款人在选择后才能办理业务。另外，除向本人同行账户转账外，个人通过自助柜员机转账的，发卡行在受理24小时后办理资金转账。在发卡行受理后24小时内，个人可向发卡行申请撤销转账。</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">石榴君看法：通过ATM机转账业务受到限制，到帐时间需要延迟24小时，如果有紧急转账需求，最好通过柜台办理。另外，ATM机转账后24小时内科撤销的规定，对于当前猖獗的电信**有一定的防范作用。</font></font></font></div><div align="left"><font><font><font color="#3e3e3e"><br></font></font></font></div><div align="left"><font><font><font color="#3e3e3e">4、6个月无交易账户暂停非柜面业务<br></font></font></font></div><div align="left"><font><font><font color="#3e3e3e"><br></font></font></font></div><div align="left"><font><font><font color="#3e3e3e">对开户之日起6个月内无交易记录的账户，银行应当暂停非柜面业务，支付机构应当暂停所有业务，待单位和个人重新向银行和支付机构核实身份后，方可恢复业务。</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">5、支付宝、微信转账约定限额</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">自12月1日起，非银行支付机构为个人开立支付账户的，同一个人在同一家支付机构只能开立一个全功能支付账户。同时要求，支付机构自12月1日起，在为单位和个人开立支付账户时，应当与单位和个人签订协议，约定支付账户与支付账户、支付账户与银行账户之间的日累计转账限额和笔数，超出限额和笔数的，不得再办理转账业务。</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">石榴君看法：按照规定，以后微信、支付宝会要求用户签订协议后才能办理在线转账业务，协议需约定一个每天转账的笔数和限额，用户每天累计转账不得超过这个约定的笔数和限额。这个协议由微信、支付宝等机构跟每个具体用户具体协商约定，具有一定的灵活度，常有转账需求的用户可以将笔数和额度上限调高一些。</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">6、大额转账需确认</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">个人银行账户非柜面转账日累计超过30万元的，银行应当进行大额交易提醒，个人确认后才可以转账。</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">石榴君看法认为：这个规定也是鼓励用户大额转账走银行柜台。</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">重头戏来了，银行账户分类管理怎么理解？</font></font></font></div><br><div align="left"><font><font><font color="#3e3e3e">12月1日起，个人在银行开立账户，每人在同一家银行，只能开立一个Ⅰ类户，如果已经有Ⅰ类户的，再开户时只能是Ⅱ、Ⅲ类账户。</font></font></font></div><div align="left"><font><font><font color="#3e3e3e"><br><div align="center"><a class="js-view-large" data-img="//bbsimg.wacdn.com/forum/201701/24/113339ef6a4c4a06944875.jpg" href="javascript:void(0)"><img data-src="//bbsimg.wacdn.com/forum/201701/24/113339ef6a4c4a06944875.jpg?imageView2/0/w/640/interlace/1" class="lazy"></a></div><br><div align="left"><div align="left"><font color="#333333"><font color="#3e3e3e">（1）什么是I类、Ⅱ类、Ⅲ类账户？<br></font></font></div><br><div align="left"><font color="#333333"><font color="#3e3e3e">Ⅰ类账户：是全功能账户，业务范围包括存款、投资理财、消费和缴费支付、转账、支取现金等，常见的借记卡、存折均属于Ⅰ类账户；</font></font></div><br><div align="left"><font color="#333333"><font color="#3e3e3e">Ⅱ类账户：限制功能账户，业务范围包括存款、投资理财、限定金额消费和缴费等，账户形式是虚拟的电子账户；</font></font></div><br><div align="left"><font color="#333333"><font color="#3e3e3e">Ⅲ类账户：限制功能账户，业务范围包括存款、限定金额消费和缴费，账户形式是虚拟的电子账户。</font></font></div><br><div align="left"><font color="#333333"><font color="#3e3e3e">Ⅰ类账户开户必须当面核验身份，Ⅱ、Ⅲ类账户开户不需要当面核验身份。</font></font></div><br><div align="left"><font color="#333333"><font color="#3e3e3e">（2）对<a href="http://bbs.wacai.com/home.php?mod=space&uid=4318673&name=%E8%80%81%E7%99%BE%E5%A7%93&code=603883&market=SH&imc=SS&popup=1&popup=1">老百姓</a>而言，三类账户的用途有什么区别？</font></font></div><br><div align="left"><font color="#333333"><font color="#3e3e3e">Ⅰ类账户可做为大额资金流转账户，可以作为工资账户、个人大额理财、大额消费账户。</font></font></div><br><div align="left"><font color="#333333"><font color="#3e3e3e">Ⅱ类账户可做为线上投资理财和消费类账户，仅可以与绑定的同名Ⅰ类账户或信用卡账户进行资金互转，可以配发实体卡片，单日最高1万，年累计20万。</font></font></div><br><div align="left"><font color="#333333"><font color="#3e3e3e">Ⅲ类账户可做为日常支付账户，日累计限额5000元，年累计限额10万元。</font></font></div><br><div align="left"><font color="#333333"><font color="#3e3e3e">（3）三类账户分别怎样开立？</font></font></div><br><div align="left"><font color="#333333"><font color="#3e3e3e">Ⅰ类账户需要银行工作人员当面核验身份后才能开立；</font></font></div><br><div align="left"><font color="#333333"><font color="#3e3e3e">Ⅱ类账户需要包含申请人姓名、居民身份证号码、手机号码、绑定账户账号（卡号）、绑定账户是否为Ⅰ类户或者信用卡账户等5个要素才能开立；</font></font></div><br><div align="left"><font color="#333333"><font color="#3e3e3e">Ⅲ类账户需要包括开户申请人姓名、居民身份证号码、手机号码、绑定账户账号（卡号）等4个要素才能开立。</font></font></div><br><div align="left"><font color="#333333"><font color="#3e3e3e">已经有的同家银行多个Ⅰ类账户怎么处理？</font></font></div><br><div align="left"><font color="#333333"><font color="#3e3e3e">银行会陆续进行排查，如招行规定“存量持多个Ⅰ类账户的客户，我行将进行排查清理”，持有同一家银行多个Ⅰ类账户的，多出账户可能会作降级处理或者停用。</font></font></div></div><br><br></font></font></font></div></div>',
                "postTime": "2011-03-10 15:52:59",
                "subject": "物价飞涨，省钱是最好理财物价飞涨，省钱是最好理财物价飞涨，省钱是最好理财物价飞涨，省钱是最好理财物价飞涨，省钱是最好理财物价飞涨，省钱是最好理财",
                reprint: 1,
                "tid": 76
            },
            "forum": {
                "fid": 16058,
                "icon": "41/common_16058_icon.png",
                "name": "财经新闻"
            },
            "tag": {
              "desc": "聊经验、讲故事、做规划……本队承包了",
              "groupId": 1,
              "icon": "https://s1.wacdn.com/wis/123/5265adc4080bf7b6_142x142.png",
              "id": 16104,
              "name": "理财承包队",
              "subscribeCount":2323,
              "threadCount":12212,
              "digestCount":222,
            },
            "downloadGuide":{
                "text":"要不要买房",
                "buttonText":"教你买房"
            },
            "hotPosts":[
              {
                "title":"聊经验、讲故事",
                "tid":16122,
                "headImgUrl": "http://avatar.wacdn.com/static/image/noavatar.gif?imageView2/1/w/120/h/120",
                "nickname":"财主123"
              },
              {
                "title":"聊经验、讲故事",
                "tid":16122,
                "headImgUrl": "http://avatar.wacdn.com/static/image/noavatar.gif?imageView2/1/w/120/h/120",
                "nickname":"财主123"
              },
              {
                "title":"聊经验、讲故事",
                "tid":16122,
                "headImgUrl": "http://avatar.wacdn.com/static/image/noavatar.gif?imageView2/1/w/120/h/120",
                "nickname":"财主123"
              },
              {
                "title":"聊经验、讲故事",
                "tid":16122,
                "headImgUrl": "http://avatar.wacdn.com/static/image/noavatar.gif?imageView2/1/w/120/h/120",
                "nickname":"财主123"
              }
            ],
            "vote": {
                "id": 1,
                "title": "你用过哪些投资方式你用过哪些投资方式你用过哪些投资方式",
                "type": 1,
                "voteCount": 101,
                "voted": false,
                "optionList": [
                    {
                        "id": 1,
                        "voteId": 1,
                        "content": "option1",
                        "voteCount": 13,
                        "voted": true
                    },
                    {
                        "id": 2,
                        "voteId": 1,
                        "content": "option2",
                        "voteCount": 12,
                        "voted": true
                    },
                    {
                        "id": 3,
                        "voteId": 1,
                        "content": "option3",
                        "voteCount": 11,
                        "voted": false
                    },
                    {
                        "id": 4,
                        "voteId": 1,
                        "content": "option4",
                        "voteCount": 14,
                        "voted": false
                    },
                    {
                        "id": 5,
                        "voteId": 1,
                        "content": "option5",
                        "voteCount": 51,
                        "voted": false
                    }
                ]
            }
        }
    };
};
