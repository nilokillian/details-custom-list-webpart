import { CamlQuery } from "@pnp/sp";

const getFieldFilterQuery = (relativeUrls: string[]): string => {
  const totalNumberOfUrls = relativeUrls.length;
  const numberOfRounds = Math.ceil(totalNumberOfUrls / 2);
  let queryPart = "";
  let tempQ = "";

  //if 2 folders selected
  if (totalNumberOfUrls === 2) {
    relativeUrls.map((relativeUrl, i) => {
      queryPart +=
        i === 0 && i !== totalNumberOfUrls - 1
          ? `<Eq>
                 <FieldRef Name="FileDirRef" />
                 <Value Type="Text">${relativeUrl}</Value>
                </Eq>`
          : `<Eq>
               <FieldRef Name="FileDirRef" />
               <Value Type="Text">${relativeUrl}</Value>
             </Eq>`;
    });
    return queryPart;
  }

  //if more then 2 folders selected
  if (totalNumberOfUrls > 2) {
    queryPart = "";

    for (let round = 0; round <= numberOfRounds - 1; round++) {
      if (round === 0) {
        const twoUrls = relativeUrls.slice(round, round + 2);

        tempQ = "";

        twoUrls.map((u, i) => {
          tempQ +=
            i === 0
              ? `<Or> 
                  <Eq>
                    <FieldRef Name="FileDirRef" />
                    <Value Type="Text">${u}</Value>
                  </Eq>`
              : `<Eq>
                   <FieldRef Name="FileDirRef" />
                   <Value Type="Text">${u}</Value>
                  </Eq>
                 </Or>`;
        });
      } else if (round > 0) {
        if (round + round + 2 <= totalNumberOfUrls) {
          const twoUrls = relativeUrls.slice(round + round, round + round + 2);

          twoUrls.map((u, i) => {
            tempQ +=
              i === 0
                ? `<Or> 
                    <Eq>
                      <FieldRef Name="FileDirRef" />
                      <Value Type="Text">${u}</Value>
                    </Eq>`
                : `<Eq>
                     <FieldRef Name="FileDirRef" />
                     <Value Type="Text">${u}</Value>
                    </Eq>
                   </Or>`;
          });
        } else if (round + round + 2 > totalNumberOfUrls) {
          const twoUrls = relativeUrls.slice(round + round);

          twoUrls.map((u, i) => {
            tempQ +=
              i === 0 && twoUrls.length !== 1
                ? `<Or>
                    <Eq>
                     <FieldRef Name="FileDirRef" />
                     <Value Type="Text">${u}</Value>
                    </Eq>`
                : i === 0 && twoUrls.length === 1
                ? `<Eq>
                    <FieldRef Name="FileDirRef" />
                    <Value Type="Text">${u}</Value>
                   </Eq>`
                : `<Eq>
                    <FieldRef Name="FileDirRef" />
                    <Value Type="Text">${u}</Value>
                   </Eq>
                  </Or>`;
          });
        }
      }
    }
  }
  return (queryPart = tempQ);
  // if (relativeUrls.length === 2) {
  //   relativeUrls.map((relativeUrl, i) => {
  //     queryPart += ` <Eq>
  //                     <FieldRef Name="FileDirRef" />
  //                     <Value Type="Text">${relativeUrl}</Value>
  //                    </Eq>`;
  //   });
  // }

  // if (relativeUrls.length === 3) {
  //   queryPart += "<Or>";
  //   queryPart += ` <Eq>
  //                   <FieldRef Name="FileDirRef" />
  //                   <Value Type="Text">${relativeUrls[0]}</Value>
  //                 </Eq>`;

  //   queryPart += ` <Eq>
  //                 <FieldRef Name="FileDirRef" />
  //                 <Value Type="Text">${relativeUrls[1]}</Value>
  //                </Eq>`;

  //   queryPart += "</Or>";
  //   queryPart += ` <Eq>
  //                   <FieldRef Name="FileDirRef" />
  //                   <Value Type="Text">${relativeUrls[2]}</Value>
  //                </Eq>`;
  // }

  // if (relativeUrls.length === 4) {
  //   queryPart += "<Or>";
  //   queryPart += ` <Eq>
  //                 <FieldRef Name="FileDirRef" />
  //                 <Value Type="Text">${relativeUrls[0]}</Value>
  //               </Eq>`;

  //   queryPart += ` <Eq>
  //                 <FieldRef Name="FileDirRef" />
  //                 <Value Type="Text">${relativeUrls[1]}</Value>
  //                </Eq>`;

  //   queryPart += "</Or>";
  //   queryPart += ` <Eq>
  //                   <FieldRef Name="FileDirRef" />
  //                   <Value Type="Text">${relativeUrls[2]}</Value>
  //                </Eq>`;
  //   queryPart += ` <Eq>
  //                    <FieldRef Name="FileDirRef" />
  //                    <Value Type="Text">${relativeUrls[3]}</Value>
  //                  </Eq>`;
  // }

  // return queryPart;
};

export const camlQueryBuilder = (
  viewCamlQuery: string,
  relativeUrls: string[]
): CamlQuery => {
  let q: CamlQuery = {};
  const startIndx = viewCamlQuery.indexOf("<Where>");
  const endIndx = viewCamlQuery.indexOf("</Where>");

  let reBuiltViewCamlQuery = "";
  if (startIndx !== -1 && endIndx !== -1) {
    reBuiltViewCamlQuery = viewCamlQuery.substring(startIndx + 7, endIndx);
  }

  if (relativeUrls.length === 1 && reBuiltViewCamlQuery) {
    q = {
      ViewXml: `<View Scope='RecursiveAll'>
                      <Query>
                       <Where>
                        <And>
                          <Eq>
                            <FieldRef Name="FileDirRef" />
                            <Value Type="Text">${relativeUrls[0]}</Value>
                         </Eq>
                        ${reBuiltViewCamlQuery}
                       </And>
                     </Where>
                     </Query>
                   </View>`
    };
  } else if (relativeUrls.length === 1 && !reBuiltViewCamlQuery) {
    q = {
      ViewXml: `<View Scope='RecursiveAll'>
                      <Query>
                       <Where>
                        <Eq>
                          <FieldRef Name="FileDirRef" />
                          <Value Type="Text">${relativeUrls[0]}</Value>
                        </Eq>
                     </Where>
                     </Query>
                   </View>`
    };
  } else if (relativeUrls.length === 0 && reBuiltViewCamlQuery) {
    q = {
      ViewXml: `<View>
                  <Query>
                    <Where>
                      ${reBuiltViewCamlQuery}
                    </Where>
                  </Query>
                </View>`
    };
  } else if (relativeUrls.length === 0 && !reBuiltViewCamlQuery) {
    q = {
      ViewXml: `<View>
                  <Query>
                  </Query>
                </View>`
    };
  } else if (relativeUrls.length > 1 && reBuiltViewCamlQuery) {
    q = {
      ViewXml: `<View Scope='RecursiveAll'>
                  <Query>
                    <Where>
                     <And>
                        ${reBuiltViewCamlQuery}
                       <Or>
                        ${getFieldFilterQuery(relativeUrls)}
                       </Or>
                     </And>  
                    </Where>
                  </Query>
                </View>`
    };
  } else if (relativeUrls.length > 1 && !reBuiltViewCamlQuery) {
    q = {
      ViewXml: `<View Scope='RecursiveAll'>
                  <Query>
                    <Where>
                       ${getFieldFilterQuery(relativeUrls)}
                    </Where>
                  </Query>
                </View>`
    };
  }
  return q;
};
