// This js dynamically edits the form
var sections = 0
function retHtml(sectionNum){
    let sectionHtml = `
    <h5>Section ${sectionNum+1}</h5>
                <div class="input-group pb-4">
                    <div class="input-group-prepend">
                        <div class="input-group-text">Name</div>
                    </div>
                    <input type="text" class="form-control" name="content[${sectionNum}][name]"  placeholder="Section Name" required>
                </div>
                <div class="input-group pb-4">
                    <div class="input-group-prepend">
                        <div class="input-group-text">Time Alloted</div>
                    </div>
                    <input type="number" class="form-control" name="content[${sectionNum}][time]"  placeholder="Hours alloted for this section" required>
                </div>
                <div class="row">
                    <div class="col-6 align-self-center text-center">
                        <h6>Sub-Sections</h6>
                        <button class="badge badge-success btn addSub" id="sub_${sectionNum}"><i class="fas fa-plus-circle"></i> Add a Sub Section</button>
                    </div>
                    <div class="col-6" id="sub_text_${sectionNum}">
                        <input type="text" class="form-control" name="content[${sectionNum}][sections][]"  placeholder="Subsection Name" required>
                        <input type="text" class="form-control" name="content[${sectionNum}][sections][]"  placeholder="Subsection Name" required>
                        <input type="text" class="form-control" name="content[${sectionNum}][sections][]"  placeholder="Subsection Name" required>
                        
                    </div>
                </div>
            </div>
`
return sectionHtml
}
function retSubsection(sectionNum){
    let subsectionHtml = `<input type="text" class="form-control" name="content[${sectionNum}][sections][]"  placeholder="Subsection Name" required>`
    return subsectionHtml
}

$("#newSection").on("click", (event)=>{
    event.preventDefault()
    // html = $("#sections").html()
    sections+=1
    // html+=retHtml(sections)
    $("#sections").append(retHtml(sections))
})

$(document).on("click",".addSub", function(event){
    event.preventDefault()
    // console.log(this.id)
    let id = this.id
    id = id.replace(/\D/g,'');
    let cl = "#sub_text_" + id

    // html = $(cl).html()
    // html+=retSubsection(id)
    $(cl).append(retSubsection(id))
})

// $("#submit").on("click", function(event){
//     event.preventDefault()
//     console.log($("form").serialize())
//     $.ajax({
//         url : "/course/new",
//         type : 'POST',
//         data : $("form").serialize(),
//         success: function(result){
//             console.log(result)
//         }
//     })
// })
