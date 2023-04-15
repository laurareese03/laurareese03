//Add files later

//Base-output is item addition

class AutoClick {
    constructor(cost, unlock_cost, base_output, owned, is_unlocked){
        this.cost = cost;
        this.unlock_cost = unlock_cost;
        this.base_output = base_output;
        this.owned = owned;
        this.is_unlocked = is_unlocked;
    }

    //getters

    get Base(){
        return this.base_output;
    };
    get Cost(){
        return this.cost;
    }
    get UnlockCost(){
        return this.unlock_cost;
    }
    get Unlock(){
        return this.is_unlocked;
    }
    get Owned(){
        return this.owned;
    }
    //setters

    setUnlockCost(unlock_cost){
        this.unlock_cost = unlock_cost;
    }
    setUnlock(){
        this.is_unlocked = this.is_unlocked;
    }
}

