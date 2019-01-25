var countFighter = 1
var countEffect = 1
var totalFighters = 0
var currentRound = 1
var timePassed = 0

var battleStarted = false
var enablePrioFighter = false
var enableChangeValues = false

var turn = -1;

function getID(fighterNode){
	return parseInt(fighterNode.id.split('-')[1])
}

function getPriority(fighterId, type="value"){
	if(type == "value")
		return document.getElementById('prioFighter-'+fighterId).value
	else
		return document.getElementById('prioFighter-'+fighterId)
}
function getInitiative(fighterId, type="value"){
	if(type == "value")
		return document.getElementById('initFighter-'+fighterId).innerHTML
	else
		return document.getElementById('initFighter-'+fighterId)
}
function getDamage(fighterId, type="value"){
	if(type == "value")
		return document.getElementById('damageFighter-'+fighterId).value
	else
		return document.getElementById('damageFighter-'+fighterId)
}
function getPerception(fighterId, type="value"){
	if(type == "value")
		return document.getElementById('percFighter-'+fighterId).value
	else
		return document.getElementById('percFighter-'+fighterId)
}
function getLife(fighterId, type="value"){
	if(type == "value")
		return document.getElementById('hpFighter-'+fighterId).value
	else
		return document.getElementById('hpFighter-'+fighterId)
}
function getCA(fighterId, type="value"){
	if(type == "value")
		return document.getElementById('caFighter-'+fighterId).value
	else
		return document.getElementById('caFighter-'+fighterId)
}


function toMinutesString(timeInSeconds){
	if(timeInSeconds == 0){
		return "0 s"
	}

	let minutes = parseInt(timeInSeconds / 60)
	let seconds = timeInSeconds % 60
	
	minString = (minutes == 0) ? null : minutes+" min"
	secString = (seconds == 0) ? null : seconds+" s"


	if(minString == null){
		return secString
	}
	else if(secString == null){
		return minString
	}

	else return minString+" "+secString
}


compareInitAndPrio = function(a,b){ 

	aId = parseInt(a.id.split('-')[1])
	bId = parseInt(b.id.split('-')[1])

	aInit = getInitiative(aId)
	aPrio = getPriority(aId)

	bInit = getInitiative(bId)
	bPrio = getPriority(bId)

	if(aInit != bInit){
		return bInit - aInit
	}
	else if(aPrio != bPrio){
		return aPrio - bPrio
	}
	else{
		return aId - bId
	}
}

// INTERFACE RELATED

function setEnablePrioFighter(){
	enablePrioFighter = !enablePrioFighter
	prioInput = document.getElementById('prioInputFighter')
	prioInput.disabled = !prioInput.disabled
}

function setEnableChangeValues(){
	enableChangeValues = !enableChangeValues
	forms = document.getElementsByClassName('fixedValue')
	for (var i = 0; i < forms.length; i++) {
		forms[i].disabled = !forms[i].disabled
	}
}


function initBattle(){
	fightersInfo = document.getElementById('fightersInfo')

	fightersArray = fightersInfo.children
	fightersArray = Array.prototype.slice.call(fightersArray, 0);

	// Sort array
	fightersArray.sort(compareInitAndPrio)	

	// Sort forms
	fightersInfo.innerHTML = "";
	for(var i = 0; i < fightersArray.length; i++) {
	    fightersInfo.appendChild(fightersArray[i]);
	}

	// Disable start button
	document.getElementById('startButton').disabled = true;

	// Enable next and end button
	document.getElementById('nextButton').disabled = false;
	document.getElementById('endButton').disabled = false;

	//Start turn of first
	turn++;
	fighters = document.getElementById('fightersInfo').children
	fighters[turn].style = "background-color: lightgreen;"

	//Update round counting
	roundsInfo = document.getElementById('roundsInfo').children
	roundsInfo[3].innerHTML = "Rodada: "+currentRound

	battleStarted = true;
}

function nextTurn(){
	fighters = document.getElementById('fightersInfo').children
	
	// Change fighter's turn
	fighters[turn].style = ""
	turn++;	
	
	
	// Round ended
	if(turn >= totalFighters){		
		currentRound++
		timePassed += 6

		// Update to first turn of the round
		turn = 0;

		// Update time counting
		roundsInfo = document.getElementById('roundsInfo').children
		roundsInfo[3].innerHTML = "Rodada: "+currentRound
		roundsInfo[4].innerHTML = "Tempo passado: "+toMinutesString(timePassed)				

		// Update effects time
		let removedEffects = []
		let effects = document.getElementById("effectsTable").children
		for (let i = 1; i < effects.length; i++) {
			// update round
			newRound = effects[i].children[2].innerHTML - 1
			if(newRound <= 0){
				removedEffects.push(effects[i].id)
				continue;
			}
			if(newRound <= 1){
				effects[i].style.backgroundColor = "#ff9696"
			}
			effects[i].children[2].innerHTML = newRound
			
			// udate time 
			let info = effects[i].children[1].innerHTML.split(" ")

			// console.log(info)
			
			let minPart = 0, secPart = 0;		

			if(info[1] == "min"){
				minPart = info[0]
				if(info.length >= 4 && info[3] == "s"){
					secPart = info[2]
				}
			}
			else if(info[1] == "s"){
				secPart = info[0]
			}

			effects[i].children[1].innerHTML = toMinutesString((parseInt(60*minPart) + parseInt(secPart)) - 6)
		}

		// Remove outdated effects
		removeEffects(removedEffects);
	}

	// Change color of current fighter
	fighters[turn].style = "background-color: lightgreen"	

	// Process damage
	for (var i = 0; i < fighters.length; i++) {

		let fighterId = getID(fighters[i])
		let lifeNode = getLife(fighterId, "node")
		let damageNode = getDamage(fighterId, "node")

		lifeNode.value = parseInt(lifeNode.value) - parseInt(damageNode.value)
		damageNode.value = 0
		
		if(lifeNode.value <= 0){
			lifeNode.value = 0			
		}

		lifeNode.style.backgroundColor = lifeNode.value > 0 ? "" : "#ff9696"	
	}
}

function addGroup(){
	inputName = document.getElementById('nameInputFighter').value
	inputInit = document.getElementById('initInputFighter').value
	inputHp = document.getElementById('hpInputFighter').value
	inputPerc = document.getElementById('percInputFighter').value
	inputCa = document.getElementById('caInputFighter').value
	inputQtd = document.getElementById('qtdInputFighter').value
	if(enablePrioFighter){
		inputPrio = document.getElementById('prioInputFighter').value
	}
	else{
		inputPrio = ""
	}
	
	if(inputName != "" && inputInit != "" && inputHp != ""){

		createFighter(inputName, inputInit, inputHp, inputPerc, inputCa, inputQtd, inputPrio)

		if(battleStarted){
			fightersInfo = document.getElementById('fightersInfo')

			fightersArray = fightersInfo.children
			fightersArray = Array.prototype.slice.call(fightersArray, 0);
			

			fightersArray.sort(compareInitAndPrio)

			// Reorder forms
			fightersInfo.innerHTML = "";
			for(var i = 0; i < fightersArray.length; i++) {

				if(fightersArray[i].style.backgroundColor == "lightgreen"){
					turn = i;
				}
			    fightersInfo.appendChild(fightersArray[i]);
			}
		}
	}
}

function addEffect(){	

	inputName = document.getElementById('nameInputEffect').value
	inputTime = document.getElementById('timeInputEffect').value
	minCondition = document.getElementById('minTimeUnit').checked
	secCondition = document.getElementById('secTimeUnit').checked

	if(inputName != "" && inputTime != "" && (minCondition || secCondition)){
		if(minCondition){
			inputTime = inputTime * 60;
		}
		if(inputTime >= 6){
			createEffect(inputName, inputTime)
		}		
	}
}

function createEffect(name, time/*in seconds*/){
	
	let newEffectRow = document.createElement('tr')
	newEffectRow.setAttribute('id', 'effect-'+countEffect)
	
	
	let nameTd = document.createElement('td')
	let timeTd = document.createElement('td')
	let roundTd = document.createElement('td')	
	let removeButtonTd = document.createElement('td')
	
	nameTd.innerHTML = name
	timeTd.innerHTML = toMinutesString(time)
	roundTd.innerHTML = parseInt(time/6)
	removeButtonTd.innerHTML = "<input type='image' src='./remove-button-2.png' style='width:18px;' onclick='removeEffect(\"effect-"+countEffect+"\")'>"
	removeButtonTd.style.borderStyle = "none"
	removeButtonTd.style.backgroundColor = "white"

	if(roundTd.innerHTML <= 1){
		newEffectRow.style.backgroundColor = "#ff9696"
	}

	newEffectRow.appendChild(nameTd)
	newEffectRow.appendChild(timeTd)
	newEffectRow.appendChild(roundTd)
	newEffectRow.appendChild(removeButtonTd)

	document.getElementById("effectsTable").appendChild(newEffectRow)

	countEffect++
}


function createFighter(name, initiative, initialHP, passPerception, ca, qtd="", priority=""){

	if(qtd == "") qtd = 1
	if(priority == "") priority = 1

	for (var i = 0; i < qtd; i++) {
		// Add form
		infoParticulares = document.createElement("div")
		infoParticulares.setAttribute('class', 'infoparticular')
		infoParticulares.setAttribute('id', 'fighter-'+countFighter)
		
		if(enableChangeValues == false){
			infoParticulares.innerHTML =
			"<div class='tableTitle'>["+countFighter+"] <b>"+name+" </b>\
			<input type='image' src='./remove-button.png' style='width:18px; float:right; margin-right: 6px;' onClick='removeFighter("+countFighter+")'>\
			</div>\
			<table>\
				<tr>\
					<td>Iniciativa/Prio:</td>\
					<td id='initFighter-"+countFighter+"' style='text-align: center; border-style: solid; border-width: 2px; background-color: white;'>"+initiative+"</td>\
					<td><input type='number' id='prioFighter-"+countFighter+"' value='"+priority+"' class='fixedValue' disabled></td>\
				</tr>\
				<tr>\
					<td>Vida/Dano:</td>\
					<td><input type='number' id='hpFighter-"+countFighter+"' value='"+initialHP+"' class='fixedValue' disabled></td>\
					<td><input type='number' id='damageFighter-"+countFighter+"' value='0' class='smallInput'></td>\
				</tr>\
					<td>Perc. Passiva:</td>\
					<td><input type='number' id='percFighter-"+countFighter+"' value='"+passPerception+"'' class='fixedValue' disabled></td>\
				<tr>\
				</tr>\
					<td>CA:</td>\
					<td><input type='number' id='caFighter-"+countFighter+"' value='"+ca+"'' class='fixedValue' disabled></td>\
				<tr>\
			</table>"
		}
		else{
			infoParticulares.innerHTML = 
			"<div class='tableTitle'>["+countFighter+"] <b>"+name+" </b>\
			<input type='image' src='./remove-button.png' style='width:18px; float:right; margin-right: 6px;' onClick='removeFighter("+countFighter+")'>\
			</div>\
			<table>\
				<tr>\
					<td>Iniciativa/Prio:</td>\
					<td id='initFighter-"+countFighter+"' style='text-align: center; border-style: solid; border-width: 2px; background-color: white;'>"+initiative+"</td>\
					<td><input type='number' id='prioFighter-"+countFighter+"' value='"+priority+"' class='fixedValue'></td>\
				</tr>\
				<tr>\
					<td>Vida/Dano:</td>\
					<td><input type='number' id='hpFighter-"+countFighter+"' value='"+initialHP+"' class='fixedValue'></td>\
					<td><input type='number' id='damageFighter-"+countFighter+"' value='0' class='smallInput'></td>\
				</tr>\
					<td>Perc. Passiva:</td>\
					<td><input type='number' id='percFighter-"+countFighter+"' value='"+passPerception+"'' class='fixedValue'></td>\
				<tr>\
				</tr>\
					<td>CA:</td>\
					<td><input type='number' id='caFighter-"+countFighter+"' value='"+ca+"'' class='fixedValue'></td>\
				<tr>\
			</table>"			
		}
		
		document.getElementById("fightersInfo").appendChild(infoParticulares)		

		countFighter++
		totalFighters++		
	}
}

function removeFighter(idNumber){
	let removed = document.getElementById('fighter-'+idNumber)
	console.log(removed.children)
	let parent = document.getElementById("fightersInfo")

	
	if(battleStarted){
		if(confirm("Deseja realmente remover da batalha o combatente "+removed.children[0].children[0].innerHTML+"["+idNumber+"]?")){
			if(removed.style.backgroundColor == 'lightgreen'){		
				if(turn+1 < totalFighters){
					parent.children[turn+1].style.backgroundColor = 'lightgreen'		
				}
				else if(totalFighters > 0){
					turn = 0;
					parent.children[0].style.backgroundColor = 'lightgreen'
				}
			}

			else{
				for (i = 0; i < parent.children.length; i++) {
					if(parent.children[i].id == 'fighter-'+idNumber){
						break;
					}	
				}
				if(turn > i){
					turn--;
				}
			}
			parent.removeChild(removed)
			totalFighters--;
		}		
	}
	else{
		parent.removeChild(removed)
		totalFighters--;
	}

	
	
}

function removeEffect(idName){
	let removed = document.getElementById(idName)
	document.getElementById("effectsTable").removeChild(removed)
}

function removeEffects(idNames){
	for (let i = 0; i < idNames.length; i++) {
		removeEffect(idNames[i])
	}	
}	


function findFighterSelect(){
	keyCode = document.getElementById('selectFighter').value
	
	if(keyCode == "noFighter"){
		document.getElementById('qtdInputFighter').value = ""
		document.getElementById('nameInputFighter').value = ""
		document.getElementById('percInputFighter').value = ""
		document.getElementById('hpInputFighter').value = ""
		document.getElementById('caInputFighter').value = ""
		document.getElementById('initInputFighter').value = ""
	}
	else{
		fighter = savedFighters[keyCode]
		document.getElementById('qtdInputFighter').value = ""
		document.getElementById('nameInputFighter').value = fighter.name 
		document.getElementById('percInputFighter').value = fighter.perc
		document.getElementById('hpInputFighter').value = fighter.hp
		document.getElementById('caInputFighter').value = fighter.ca
		document.getElementById('initInputFighter').value = ""
	}
}

function findEffectSelect(){
	keyCode = document.getElementById('selectEffect').value
	
	if(keyCode == "noEffect"){
		document.getElementById('nameInputEffect').value = ""
		document.getElementById('timeInputEffect').value = ""
		document.getElementById('minTimeUnit').value.checked = false
		document.getElementById('secTimeUnit').value.checked = false

	}
	else{
		effect = savedEffects[keyCode]
		document.getElementById('nameInputEffect').value = effect.name
		document.getElementById('timeInputEffect').value = effect.time
		document.getElementById('minTimeUnit').checked = (effect.unit == "min") ? true : false
		document.getElementById('secTimeUnit').checked = (effect.unit == "sec") ? true : false
	}
}



function deleteForm(index, type){
	if(type == 'fighter') excluido = document.getElementById("fighter"+index)

	if(excluido.parentNode){
		excluido.parentNode.removeChild(excluido)
	}
}


function loadFightersAndEffects(){
	// Add fighters
	let select = document.getElementById('selectFighter')

	let option = document.createElement('option')
	option.value = "noFighter"
	option.innerHTML = ""
	select.appendChild(option)

	for (var key in savedFighters) {
		option = document.createElement('option')
		option.value = key
		option.innerHTML = savedFighters[key].name
		select.appendChild(option)
	}


	// Add effects
	select = document.getElementById('selectEffect')

	option = document.createElement('option')
	option.value = "noEffect"
	option.innerHTML = ""
	select.appendChild(option)

	for (var key in savedEffects) {
		let option = document.createElement('option')
		option.value = key
		option.innerHTML = savedEffects[key].name
		select.appendChild(option)
	}
}

