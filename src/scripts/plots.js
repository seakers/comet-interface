import * as _ from "lodash";


export function get_scatter_plot(objectives, designs_sub, objective_axis) {


    // --> Scatterplots can handle up to 3 objectives (for now)

    if(objectives.length === 1){
        return scatter1d_plot(objectives, designs_sub);
    }
    else if(objectives.length === 2){
        return scatter2d_plot(objectives, designs_sub);
    }
    else if(objectives.length === 3){
        return scatter3d_plot(objectives, designs_sub);
    }
    else{
        return { data: [], layout: {} }
    }
}


function scatter1d_plot(objectives, designs_sub){
    // --> 1. Create traces
    let trace = {
        x: [0.2, 0.4, 0.6, 0.8],
        y: [0, 0, 0, 0],
        type: 'scatter',
        mode: 'markers',
        marker: {
            color: '#122446',
            size: 12,
        },
        customdata: [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }]
    }

    // --> 2. Get axis / text data
    trace.x = get_axis_data(designs_sub, objectives[0].id);

    trace.y = [];
    for(let x = 0; x < trace.x.length; x++){
        trace.y.push(0);
    }

    trace.text = get_text_data(designs_sub);

    trace = integrate_customdata(trace, designs_sub);

    // --> 3. Create data from traces
    let data = [trace]

    // --> 4. Create layout / scene
    let layout = {
        title: '1D Scatterplot',
        autosize: true,
        hovermode:'closest',
        xaxis: { title: objectives[0]['name'], gridcolor: "#ffffff", zerolinecolor: "#ffffff" },
        yaxis: { title: '', gridcolor: "#ffffff", zerolinecolor: "#ffffff" },
        plot_bgcolor:"#e5ecf6",
        paper_bgcolor:"#ffffff",
    }

    return {
        data: data,
        layout: layout
    }
}

function scatter2d_plot(objectives, designs_sub){

    // --> 1. Create traces
    let trace = {
        x: [0.2, 0.4, 0.6, 0.8],
        y: [10, 20, 30, 60],
        // text: ['110100', '100111', '001100', '100010'],
        type: 'scatter2d',
        mode: 'markers',
        marker: {
            color: '#122446',
            size: 12,
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

    // trace.text = get_text_data(designs_sub);
    // console.log('--> TEXT DATA', trace.text);

    trace = integrate_customdata(trace, designs_sub);

    // --> 2. Create data from traces
    let data = [trace]

    // --> 3. Create layout
    let layout = {
        title: '2D Scatterplot',
        autosize: true,
        hovermode:'closest',
        xaxis: { title: objectives[0]['name'], gridcolor: "#ffffff", zerolinecolor: "#ffffff" },
        yaxis: { title: objectives[1]['name'], gridcolor: "#ffffff", zerolinecolor: "#ffffff" },
        plot_bgcolor:"#e5ecf6",
        paper_bgcolor:"#ffffff",
        hoverlabel: {
            bgcolor: 'white'
        }
    }

    return {
        data: data,
        layout: layout
    }
}

function scatter3d_plot(objectives, designs_sub){

    // --> 1. Create traces
    let trace = {
        x: [0.2, 0.4, 0.6, 0.8],
        y: [10, 20, 30, 60],
        z: [10, 20, 30, 60],
        text: ['110100', '100111', '001100', '100010'],
        type: 'scatter3d',
        mode: 'markers',
        marker: {
            color: '#122446',
            size: 12,
        },
    }

    // --> 2. Get axis / text data
    trace.x = get_axis_data(designs_sub, objectives[0].id);

    trace.y = get_axis_data(designs_sub, objectives[1].id);

    trace.z = get_axis_data(designs_sub, objectives[2].id);

    trace.text = get_text_data(designs_sub);

    trace = integrate_customdata(trace, designs_sub);

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
        plot_bgcolor:"#ffffff",
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
    let labels = [];
    for(let x = 0; x < customdata.length; x++){
        if(customdata[x].clicked === true){
            color.push('#F44336');
            size.push(15);
        }
        else if(customdata[x].hovered === true){
            color.push('#ff8200');
            size.push(13);
        }
        else if(customdata[x].origin.startsWith("GA-")){
            color.push('#76FF03');
            size.push(10);
        }
        else {
            color.push('#122446');
            size.push(10);
        }
        labels.push('testt');
    }

    trace.customdata = customdata
    trace.labels = labels;
    trace.marker.color = color;
    trace.marker.size = size;
    return trace;
}








