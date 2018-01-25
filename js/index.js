///////////////////////////////  角色設定  /////////////////////////////// 
// base attributes and methods
class BaseCharacter {
  constructor(name, hp, ap) {
    this.name = name;
    this.hp = hp;
    this.maxHp = hp;
    this.ap = ap;
    this.alive = true;
  }

  attack(character, damage) {
    if (this.alive == false) {
      return;
    }
    character.getHurt(damage);
  } 

  getHurt(damage) {
    // 透過damage減少角色hp
    this.hp -= damage;
    // 確認角色live or die
    if (this.hp <= 0) {
      this.die();
    }
    // 加入特效&傷害數字
    var _this = this;
    var i = 1;
    // 抽換圖片特效和加入傷害數字
    _this.id = setInterval(function() {

      // i 為1時開始播放
      if ( i == 1) {
        // 取得effect-image class，並設定為顯示
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block";
        // 取得hurt-text class，添加attacked class for 向上移動的效果
        _this.element.getElementsByClassName("hurt-text")[0].classList.add("attacked");
        // 取得hurt-text class，賦予damage數值
        _this.element.getElementsByClassName("hurt-text")[0].textContent = damage;
      }

      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/blade/' + i + '.png';
      i++;

      // i大於8時播放完畢
      if (i > 8) {
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none";
        _this.element.getElementsByClassName("hurt-text")[0].classList.remove("attacked");
        _this.element.getElementsByClassName("hurt-text")[0].textContent = "";
        clearInterval(_this.id);
      }

    },80);
  }

  die() {
    this.alive = false;
  }

  // update hp & hp-bar
  updateHtml(hpElement, hurtElement) {
    // hp > 0時正常顯示，hp < 0則顯示0
    if (this.hp <= 0) {
      hpElement.textContent = "0";
    } else {
      hpElement.textContent = this.hp;
    }
    hurtElement.style.width = (100 - this.hp/this.maxHp * 100) + "%";
  }

  // get heal
  getHeal(heal) {
    // hero hp + heal
    hero.hp += heal;
    // 判斷heal值有無超過maxHp，超過則顯示maxHp，若無則正常顯示
    if (hero.hp > hero.maxHp) {
      hero.hp = hero.maxHp;
    }
    // update hero 的HTML上顯示的hp及hp-bar
    hero.updateHtml(hero.hpElement, hero.hurtElement);

    // 加入heal數字&特效
    var _this = this;
    var i = 1;

    _this.id = setInterval(function() {
      // i = 1 為開始播放
      if ( i == 1 ) {
        // 取得effect-image class 並設為顯示
        _this.element.getElementsByClassName("effect-image")[0].style.display = "block"
        // 取得heal-text class，並加入healed class顯示向上css效果
        _this.element.getElementsByClassName("heal-text")[0].classList.add("healed");
        // 取得healed class，並賦予heal值
        _this.element.getElementsByClassName("heal-text")[0].textContent = heal;
      }

      _this.element.getElementsByClassName("effect-image")[0].src = 'images/effect/heal/' + i + '.png';
      i++;


      // i = 2 結束效果
      if ( i == 8 ) {
        // 隱蔽effect-image class
        _this.element.getElementsByClassName("effect-image")[0].style.display = "none"
        // 移除healed class
        _this.element.getElementsByClassName("heal-text")[0].classList.remove("healed");
        // 歸零heal-text
        _this.element.getElementsByClassName("heal-text")[0].textContent = "";
        // 結束倒數計時
        clearInterval(_this.id);
      }

    },80);

  }

}

// hero class
class Hero extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);
    
    // connect HTML and JavaScript
    this.element = document.getElementById("hero-image-block");
    this.hpElement = document.getElementById("hero-hp");
    this.maxHpElement = document.getElementById("hero-max-hp");
    this.hurtElement = document.getElementById("hero-hp-hurt");

    // hero hp update
    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log("招喚英雄: " + this.name + "!");
  }

  attack(character) {
    var damage = Math.random() * (this.ap / 2) + (this.ap /2);
    super.attack(character, Math.floor(damage));
  }

  // hero hp update
  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }

}

// monster class
class Monster extends BaseCharacter {
  constructor(name, hp, ap) {
    super(name, hp, ap);

    // connect HTML and JavaScript
    this.element = document.getElementById("monster-image-block");
    this.hpElement = document.getElementById("monster-hp");
    this.maxHpElement = document.getElementById("monster-max-hp");
    this.hurtElement = document.getElementById("monster-hp-hurt");

    // monster hp update
    this.hpElement.textContent = this.hp;
    this.maxHpElement.textContent = this.maxHp;

    console.log("招喚怪物: " + this.name + "!");
  }

  attack(character) {
    var damage = Math.random() * (this.ap / 2) + (this.ap / 2);
    super.attack(character, Math.floor(damage));
  }

  // monster hp update
  getHurt(damage) {
    super.getHurt(damage);
    this.updateHtml(this.hpElement, this.hurtElement);
  }
}

// Create Hero & Monster
var hero = new Hero("Bernard", 130, 30);
var monster = new Monster("Arch", 130, 50);

///////////////////////////////  戰鬥設定  /////////////////////////////// 

// 戰鬥回合結束
var rounds = 10;
function endTurn() {
  rounds --;
  document.getElementById("round-num").textContent = rounds;
  if (rounds < 1) {
    // Game over
    finish();
  }
}


// onkeyup 要驅動的function
document.onkeyup = function(event) {
  // 將keyCode轉成字元
  var key = String.fromCharCode(event.keyCode);
  // 按下A時，發動攻擊
  if ( key == "A" ) {
    heroAttack();
  }
  // 按下D時，恢復hp
  if ( key == "D" ) {
    heroHeal();
  }
}


// hero and monster 透過heroAttack開始動作&動作時間軸
function heroAttack() {
  // 點擊後隱藏skill-block
  document.getElementsByClassName("skill-block")[0].style.display = "none";
  // setTimeout for 英雄移動，1st setTimeout for 英雄前進
  setTimeout(function() {
    // 英雄前進
    hero.element.classList.add("attacking");
    // 2nd setTimeout for 英雄攻擊&回原位
    setTimeout(function(){
      hero.attack(monster);
      hero.element.classList.remove("attacking");
    }, 500)
  }, 100);

  // setTimeout for 怪物移動，1st setTimeout for 怪物前進或結束遊戲
  setTimeout(function() {
    // 判斷怪獸是否陣亡，活則攻擊，死則結束。
    if (monster.alive) {
      // 怪物前進
      monster.element.classList.add("attacking");
      // 2nd setTimeout for 怪物攻擊&回原位並結束1 round
      setTimeout(function() {
        monster.attack(hero);
        monster.element.classList.remove("attacking");
        // 結束 1 round
        endTurn();
        // 判斷英雄生死
        if (hero.alive == false) {
          // hero 死亡 Gameover
          finish();
        } else {
          // 遊戲尚未結束，重新顯示hero skill-block
          document.getElementsByClassName("skill-block")[0].style.display = "block";
        }
      }, 500);

    } else {
      // monster 死亡，Gameover
      finish();
    };

  },1100);
}


// hero 透過heroHeal開始恢復hp，而怪物進行攻擊
function heroHeal() {
  // 點擊後隱藏skill block
  document.getElementsByClassName("skill-block")[0].style.display = "none";
  // setTimeout for 英雄回血， 1st setTimeout for 英雄回血 
  setTimeout(function() {
    // 英雄回血，一次+30HP
    hero.getHeal(30);
  }, 100);

  // setTimeout for 怪物移動， 1st setTimeout for怪物移動
  setTimeout(function(){
    // 怪物前進
    monster.element.classList.add("attacking");
    // 2nd setTimeout for 怪物攻擊&回原位結束1 round
    setTimeout(function() {
      monster.attack(hero);
      monster.element.classList.remove("attacking");
      // 結束i round
      endTurn();
      // 判斷英雄生死
      if (hero.alive == false) {
        // hero die , Gameover
        finish();
      } else {
        // 遊戲尚未結束，顯示skill-block繼續遊戲
        document.getElementsByClassName("skill-block")[0].style.display = "block";
      }
    }, 500);
  }, 1100);

  

}

///////////////////////////////  事件驅動  /////////////////////////////// 

// 設定skill點擊後戰鬥開始
function addSkillEvent() {
  var skill = document.getElementById("skill");
  skill.onclick = function() {
    heroAttack();
  }
}
addSkillEvent(); //驅動skill事件

// 設定heal點擊後開始治癒恢復hp
function addHealEvent() {
  var heal = document.getElementById("heal");
  heal.onclick = function() {
    heroHeal();
  }
}
addHealEvent(); //驅動heal事件

// 勝負判斷、開啟重設按鈕
function finish() {
  var dialog = document.getElementById("dialog");
  dialog.style.display = "block";
  if (monster.alive == false) {
    dialog.classList.add("win");
  } else {
    dialog.classList.add("lose");
  }
}

