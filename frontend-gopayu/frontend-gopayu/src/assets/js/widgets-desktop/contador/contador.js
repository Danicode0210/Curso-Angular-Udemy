const getRemainingTime=deadline=>{let now=new Date(),remainTime=(new Date(deadline)-now+1000)/1000,remainSeconds=('0'+Math.floor(remainTime%60)).slice(-2),remainMinutes=('0'+Math.floor(remainTime/60%60)).slice(-2),remainHours=('0'+Math.floor(remainTime/3600%24)).slice(-2),remainDays=Math.floor(remainTime/(3600*24));return{remainSeconds,remainMinutes,remainHours,remainDays,remainTime}};const countdown=(deadline,elem,finalMessage)=>{const el=document.getElementById(elem);const timerUpdate=setInterval(()=>{let t=getRemainingTime(deadline);el.innerHTML=`


<div align="center" style="padding-top:2px; background-color:rgba(2,0,80,0.4); overflow:hidden; width:370px; height:32px; font-size:32px; margin-top:142px;">

		<div style="color:#fff; font-family:Arial, Helvetica, sans-serif; font-weight:bold; text-decoration:none">
			${t.remainDays} - ${t.remainHours} : ${t.remainMinutes} : ${t.remainSeconds}
		</div>
</div>`;if(t.remainTime<=1){clearInterval(timerUpdate);el.innerHTML=finalMessage;}},1000)};countdown('Jun 14 2018 10:00:00','clock','Â¡Ya empezÃ³!');
