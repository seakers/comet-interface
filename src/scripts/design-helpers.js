

export function convertDesign(design) {
    let point_design = []
    if(typeof design === 'string') {
        for(let x = 0; x < design.length; x++){
            point_design.push(parseInt(design[x]))
        }
    }
    else{
        point_design = design;
    }
    return point_design;
}