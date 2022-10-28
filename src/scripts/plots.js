


export function get_scatter_plot(objectives, designs_sub, point_customdata) {

    // --> Scatterplots can handle up to 3 objectives (for now)

    if(objectives.length === 1){
        return scatter1d_plot(objectives, designs_sub, point_customdata);
    }
    else if(objectives.length === 2){
        return scatter2d_plot(objectives, designs_sub, point_customdata);
    }
    else if(objectives.length === 3){
        return scatter3d_plot(objectives, designs_sub, point_customdata);
    }
    else{
        return { data: [], layout: {} }
    }
}


function scatter1d_plot(objectives, designs_sub, point_customdata){
    // --> 1. Create traces
    let trace = {
        x: [0.2, 0.4, 0.6, 0.8],
        y: [0, 0, 0, 0],
        type: 'scatter',
        mode: 'markers',
    }

    // --> 2. Get axis / text data
    trace.x = get_axis_data(designs_sub, objectives[0].id);
    console.log('--> X DATA', trace.x);

    trace.text = get_text_data(designs_sub);
    console.log('--> TEXT DATA', trace.text);

    integrate_customdata(trace, point_customdata);

    // --> 3. Create data from traces
    let data = [trace]

    // --> 4. Create layout
    let layout = {
        title: '1D Scatterplot',
        autosize: true,
        hovermode:'closest',
        xaxis: { title: objectives[0]['name'] },
        yaxis: { title: '' }
    }

    return {
        data: data,
        layout: layout
    }
}

function scatter2d_plot(objectives, designs_sub, point_customdata){

    // --> 1. Create traces
    let trace = {
        x: [0.2, 0.4, 0.6, 0.8],
        y: [10, 20, 30, 60],
        text: ['110100', '100111', '001100', '100010'],
        type: 'scatter2d',
        mode: 'markers',
        marker: {
            color: 'rgb(17, 157, 255)',
            size: 5,
            // line: {
            //     color: 'rgb(231, 99, 250)',
            //     width: 2
            // }
        },
        customdata: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
    }

    // --> 2. Get axis / text data
    trace.x = get_axis_data(designs_sub, objectives[0].id);
    // console.log('--> X DATA', trace.x);

    trace.y = get_axis_data(designs_sub, objectives[1].id);
    // console.log('--> Y DATA', trace.y);

    trace.text = get_text_data(designs_sub);
    // console.log('--> TEXT DATA', trace.text);

    trace = integrate_customdata(trace, point_customdata);

    // --> 2. Create data from traces
    let data = [trace]

    // --> 3. Create layout
    let layout = {
        title: '2D Scatterplot',
        autosize: true,
        hovermode:'closest',
        xaxis: { title: objectives[0]['name'] },
        yaxis: { title: objectives[1]['name'] },
        // plot_bgcolor:"lightgrey",
    }

    return {
        data: data,
        layout: layout
    }
}

function scatter3d_plot(objectives, designs_sub, point_customdata){

    // --> 1. Create traces
    let trace = {
        x: [0.2, 0.4, 0.6, 0.8],
        y: [10, 20, 30, 60],
        z: [10, 20, 30, 60],
        text: ['110100', '100111', '001100', '100010'],
        type: 'scatter3d',
        mode: 'markers',
    }

    // --> 2. Get axis / text data
    trace.x = get_axis_data(designs_sub, objectives[0].id);
    console.log('--> X DATA', trace.x);

    trace.y = get_axis_data(designs_sub, objectives[1].id);
    console.log('--> Y DATA', trace.y);

    trace.z = get_axis_data(designs_sub, objectives[2].id);
    console.log('--> Z DATA', trace.z);

    trace.text = get_text_data(designs_sub);
    console.log('--> TEXT DATA', trace.text);

    integrate_customdata(trace, point_customdata);

    // --> 3. Create data from traces
    let data = [trace]

    // --> 4. Create layout
    let layout = {
        title: '3D Scatterplot',
        autosize: true,
        hovermode:'closest',
        scene: {
            xaxis: { title: objectives[0]['name'] },
            yaxis: { title: objectives[1]['name'] },
            zaxis: { title: objectives[2]['name'] },
        },
        margin: {
            l: 0,
            r: 0,
            b: 0,
            t: 0,
        },
    }

    return {
        data: data,
        layout: layout
    }
}



// ---------------
// --- HELPERS ---
// ---------------


function get_axis_data(designs_sub, objective_id){
    let axis_data = [];
    for(let x = 0; x < designs_sub.length; x++){
        let design = designs_sub[x];
        for(let y = 0; y < design.objectives.length; y++){
            if(design.objectives[y]['objective_id'] === objective_id){
                axis_data.push(design.objectives[y].value);
            }
        }
    }
    return axis_data;
}


function get_text_data(designs_sub){
    let text_data = [];
    for(let x = 0; x < designs_sub.length; x++){
        let design = designs_sub[x];
        text_data.push(design.representation);
    }
    return text_data;
}

function integrate_customdata(trace, customdata){
    let color = [];
    let size = [];
    for(let x = 0; x < customdata.length; x++){
        if(customdata[x].highlighted === true){
            color.push('red');
            size.push(9);
        }
        else {
            color.push('#122446');
            size.push(8);
        }
    }

    trace.customdata = customdata
    trace.marker.color = color;
    trace.marker.size = size;
    return trace;
}








