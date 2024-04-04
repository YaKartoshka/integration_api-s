const express = require('express');
const app = express();
const port = 3000;
const { getEncoding, encodingForModel } = require("js-tiktoken");
const enc = getEncoding("cl100k_base");

var text = `
Перечень основных требований к оказанию государственной услуги "Оформление документов на обеспечение лиц с инвалидностью услугами специалиста жестового языка для лиц с инвалидностью по слуху":
1. Услугодатели: местные исполнительные органы городов Астаны, Aлматы и Шымкент, районов и городов областного значения.
2. Способы предоставления: 1) Госкорпорация; 2) МИО городов Астаны, Алматы и Шымкент, районов и городов областного значения; 3) абонентское устройство - проактивная услуга; 4) веб-портал www.egov.kz.
3. Срок оказания: 1) при обращении в Госкорпорацию, горуправления, отделы занятости – 5 рабочих дней; проактивная услуга – 5 рабочих дней; через веб-портал – 5 рабочих дней. Максимальное время ожидания и обслуживания: в Госкорпорации – 15 минут, в горуправлениях, отделах занятости – 30 минут.
4. Форма оказания: бумажная/проактивная/электронная.
5. Результат: уведомление об оформлении документов либо мотивированный отказ. Информирование заявителя через смс-уведомление или в "личный кабинет" на веб-портале.
6. Размер оплаты: бесплатно.
7. График работы: Госкорпорации – пн-пт 9:00-18:00, дежурные отделы пн-пт 9:00-20:00, сб 9:00-13:00; горуправлений, отделов занятости – 9:00-18:00/18:30/19:00 с перерывом 13:00-14:00/14:30/15:00; веб-портала – круглосуточно.
8. Перечень документов: заявление, удостоверение личности, доверенность (при необходимости). Сведения из госинформсистем получаются в электронном виде.
9. Основания для отказа: недостоверность документов, несоответствие требованиям, отсутствие согласия на доступ к персональным данным.
10. Адреса мест оказания размещены на сайтах уполномоченного органа и Госкорпорации. Информация доступна через справочные службы, контакт-центр. Цифровые документы доступны через мобильное приложение после авторизации.
`

app.post('/token_count', (req,res)=>{
    // var text = req.body.text;
    var tokens = enc.encode(text);
    console.log(tokens.length);
    res.send(JSON.stringify(tokens.length));
})

function getTokenCount(){
    var tokens = enc.encode(text);
    console.log(tokens.length);
}

getTokenCount()


app.listen(port, ()=>{
    console.log('Started')
})