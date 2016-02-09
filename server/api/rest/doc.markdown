# Routes

## Match

* `/match/`
    * type : GET
* `/match/:id`
    * type : GET
* `/match/`
    * type : POST
    * mandatory params : "teamA", "colorA", "teamB", "colorB"
    * public : false
* `/match/:id/report/recap/`
    * type : GET
* `/match/event/`
    * type : POST
    * mandatory params : "matchId","team"
    * optional params : "twoMissing","twoSuccess","treeMissing","treeSuccess","oneMissing","oneSuccess","fault"
    * public : false
* `/match/:id/event/`
    * type : DELETE
    * public : false