import { parseString } from "xml2js";

export const xmlParser = (view: any) => {
  let fields: any[];
  let viewId: string = "";
  let viewCamlQ: string = "";
  // console.log("xml", xml);

  parseString(view.ListViewXml, (err, result) => {
    viewId = result.View.$.Name.split("{")[1].split("}")[0];
    fields = result.View.ViewFields[0].FieldRef.map(fn => fn.$.Name);

    // viewCamlQ =
    // && f.$.Name !== "LinkFilenameNoMenu"
    //return fields;
  });

  // parseString(view.ViewQuery, (err, result) => {
  //   viewCamlQ = result;

  //   console.log("result", result);
  //   // && f.$.Name !== "LinkFilenameNoMenu"
  //   //return fields;
  // });

  return { viewFields: fields, viewId: viewId };
};
