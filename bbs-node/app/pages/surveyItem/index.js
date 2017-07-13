require('./index.less');

import request from 'request';
import Toast from '@wac/toast';
import url from 'url';
import {connect} from '@wac/bridge-utils';
if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'){
     const vconsole = require('vconsole');
}

const INIT_DATA = window.INIT_DATA;

 const parsed = url.parse(location.href, true, true);
 const guideQuestionId = parsed.query.id;

// 右上角只能挂载window作用域才生效
window.updateCheckboxValue = function() {
    const checkBoxs = $('input[data-type=2]');
    const answerArray = [];
    checkBoxs.each((idx, ele) => {
        if(ele.checked) {
            answerArray.push(ele.value);
        }
    })
    if(answerArray.length==0){
        Toast('选择不能为空哦');
    }else{
        request({
            method: 'post',
            data: {
                guideQuestionId,
                guideAnswerIds: answerArray.join(',')
            },
            url: '/qa/update_survey_answer'
        }).then((ret) => {
            setTimeout(() => {
                window.location = 'wacai://close';
            }, 40)
        }).catch((err) => {
            console.error(err);
        });
    }   
}

class App {
    constructor() {
        this.init();
    }
    init() {
        this.initBridge();
        this.bindEvts();
    }

    initBridge() {
        const that = this;
        if(INIT_DATA.type != 2) return;

        connect(bridge => {
            bridge.isSupport('setNavButton')
                .then((isSupport) => {
                    //console.log(`isSupport is ${isSupport}`)
                    bridge.setNavButton([{
                        text: '完成',
                        message: 'window.updateCheckboxValue()'
                    }])
                })
                .catch(err => {
                    console.error(err);
                });
        });   
    }

    updateAnswer(guideQuestionId, guideAnswerIds){
        request({
            method: 'post',
            data: {
                guideQuestionId,
                guideAnswerIds
            },
            url: '/qa/update_survey_answer'
        }).then((ret) => {
            setTimeout(() => {
                window.location = 'wacai://close'; 
            }, 40)
        }).catch((err) => {
            console.error(err);
        });
    }
    
    bindEvts() {
        const el = $(document);

        const EVENTS = {
            '.weui_cell': {
                click: (e) => {
                    
                    let currentDOM = e.currentTarget;
                    let checkEle = $(currentDOM).find('.weui_check');
                    let checkEleDom=checkEle[0];
                    let eleBoxs=$('input[type=' + checkEleDom.type + '][name=' + checkEleDom.name + ']');
                    let questionsArr=[];//存放结果
                    switch(checkEleDom.type){
                        //单选
                        case "radio":
                            eleBoxs.each(function () {
                                $(this).closest('.weui_cell').removeClass('active');
                                $(this).removeAttr('checked');
                            });
                            //改变状态
                            checkEle.prop("checked",true);
                            $(currentDOM).addClass('active');
                        break;
                        //多选
                        case "checkbox":
                                if(!checkEle.prop("checked")){
                                    $(currentDOM).removeClass('active');
                                }else{
                                    $(currentDOM).addClass('active');
                                }
                        break;

                    }
                    //得到最终的选择结果
                    eleBoxs.each(function () {
                            if($(this).prop('checked')){
                                questionsArr.push($(this).val());
                            }
                    });
                    if (INIT_DATA.type == 1) {
                        this.updateAnswer(guideQuestionId, questionsArr[0]);  //dev－disable：to find bug source 提交开关
                    }
                    
                }
            }
        }

        $.each(EVENTS, (selector, events) => {
            $.each(events, (type, handler) => {
                el.on(type, selector, handler.bind(this));
            });
        });
    }
}

new App();