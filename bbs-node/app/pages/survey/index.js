require('./index.less');

import Velocity from 'velocity-animate';
import request from 'request';
import Toast from '@wac/toast';
require('@finance/validator');
import { connect } from '@wac/bridge-utils';
if(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'){
     const vconsole = require('vconsole');
}

class App {
    constructor() {
        this.len = window.INIT_DATA.count;
        this.state = {
            currentIndex: 1,
            questions: {}
        };
        this.init();
    }

    init() {
        this.initState();
        this.bindEvts();
        this.initBridge();
        this.formValidator();
    }

    initBridge() {
        connect(bridge => {
            bridge.addEventListener('BBSNetStatChange', (opt)=>{
                console.log(opt);
                let data;
                if(typeof opt == 'string') {
                    data = JSON.parse(opt);
                } else {
                    data = opt;
                }

                const {onActive, didSurvey} = data;


                console.log(`onActive is ${onActive} didSurvey is ${didSurvey}`)
                if(onActive && didSurvey) {
                    bridge.close();
                }
            })
        });
    }

    initState() {
        const { questions = [] } = window.INIT_DATA;

        questions.forEach((question) => {
            this.state.questions[question.id] = [];
        })

        // 初始化页面发送埋点
        Stat.send('stat', {
            evt: 'page_financial_gene'
        });
    }

    formValidator(){
        const that = this;
        $('#formContainer').validator({
            identifie: '[required]',
            autoValidate : true,
            onSubmitActive: true,
            successCallback: that.submitSurvey.bind(that)
        })
    }

    closeView(callback) {
        if(callback) callback();
    }

    submitSurvey(){
        const { questions } = this.state;
       
        // 校验答案
        for(let key in questions){
            if(!questions[key].length){
                Toast('还有未完成的题目哦');
                break;
            }
        }

        request({
            method: 'post',
            data: {
                survey: JSON.stringify(questions)
            },
            url: '/qa/save_survey_answer'
        }).then((ret) => {
            Toast('理财问卷提交成功');
            Stat.send('stat', {evt : 'financial_gene_submit'});
            setTimeout(() => {
                this.closeView(() => {
                     window.location.href = 'nt://sdk-bbs2/askQuestion?nt_present=1&didSurvey=true';
                });
            }, 1000)
        }).catch((err) => {
            console.error(err);
        });
    }

    bindEvts() {
        const el = $(document);
        const oContainer = $('#js-cardContainer')

        let flag = false;

        const EVENTS = {
            '.weui_check': {
                change: (e) => {
                    if(!!flag) return;
                    flag = true;
                    const inputElement = e.target;
                    const oInput = $(inputElement);
                    let type = oInput.data('type');

                    let questionsArr = this.state.questions[type];
                    
                    // 判断是否选中或取消
                    var eleBoxs=$('input[type=' + inputElement.type + '][name=' + inputElement.name + ']');

                    eleBoxs.each(function() {
                        let oEle = $(this);
                        let oParent = oEle.closest('.weui_cell');

                        if ($(this).prop('checked')) {
                        !questionsArr.includes(oEle.val()) && questionsArr.push(oEle.val());
                        oParent.addClass('active');
                        }else{
                        questionsArr.includes(oEle.val()) && questionsArr.splice(questionsArr.indexOf(oEle.val()),1)
                            oParent.removeClass('active');
                        }
                    })
                    
                    
                    // 最后一项特殊处理
                    if( this.state.currentIndex >= this.len){
                        flag = false;
                        return
                    }
                    let translateX = -(100/this.len * this.state.currentIndex)+'%';
                    this.state.currentIndex++;
                    
                    Velocity(oContainer, {
                       translateX
                    }, {
                        duration: 400,
                        delay:200,
                        easing: 'ease',
                        begin: () => {
                            //安卓机第一个选项标题残留
                            oContainer.find('.card').eq(0).find('.indicTxt').addClass('hidden');
                            oContainer
                                .find('.card')
                                .eq(this.state.currentIndex-1)
                                .addClass('pe')
                                .removeClass('hidden')
                        },
                        complete: () => {
                           
                             oContainer
                                .find('.card')
                                .eq(this.state.currentIndex-1)
                                .removeClass('pe')
                            flag = false;
                        }
                    });
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