/*
 * 免税州地址数据
 *
 * 每个城市的邮编 (ZIP) 均已对照 USPS 邮编库核实：邮编属于该州、为普通投递邮编 (STANDARD)、
 * 并且邮编的默认城市名或可接受城市名与这里的城市一致。街道为该城市/区域真实存在的主要道路，
 * 门牌号在 num 区间内随机生成。
 *
 * 结构：
 *   states[].cities[].zones[] = { zips: [...], streets: [...], num?: [min, max] }
 *   zone 中的 num 会覆盖城市级的 num。
 */
(function (root) {
  const DATA = {
    states: [
      {
        code: "OR",
        name: "Oregon",
        zh: "俄勒冈州",
        recommended: true,
        tax: "全州无销售税（州和地方均不征收），最常用、最稳妥的选择。",
        cities: [
          {
            name: "Portland",
            zh: "波特兰",
            areaCodes: ["503", "971"],
            num: [100, 4999],
            zones: [
              {
                zips: ["97201", "97204", "97205"],
                num: [100, 1999],
                streets: ["SW Broadway", "SW 5th Ave", "SW 4th Ave", "SW Morrison St", "SW Salmon St",
                  "SW Main St", "SW Park Ave", "SW 10th Ave", "SW Jefferson St", "SW Columbia St"]
              },
              {
                zips: ["97209", "97210"],
                num: [100, 2999],
                streets: ["NW 23rd Ave", "NW 21st Ave", "NW Glisan St", "NW Lovejoy St", "NW Everett St",
                  "NW Kearney St", "NW Thurman St", "NW Johnson St"]
              },
              {
                zips: ["97219", "97221", "97239"],
                streets: ["SW Barbur Blvd", "SW Capitol Hwy", "SW Multnomah Blvd", "SW Macadam Ave",
                  "SW Terwilliger Blvd", "SW Vermont St"]
              },
              {
                zips: ["97203", "97217", "97227"],
                streets: ["N Lombard St", "N Interstate Ave", "N Mississippi Ave", "N Williams Ave",
                  "N Denver Ave", "N Albina Ave", "N Killingsworth St"]
              },
              {
                zips: ["97211", "97212", "97213", "97232"],
                streets: ["NE Alberta St", "NE Killingsworth St", "NE Fremont St", "NE Broadway",
                  "NE Sandy Blvd", "NE Glisan St", "NE Halsey St", "NE 15th Ave", "NE Prescott St"]
              },
              {
                zips: ["97202", "97206", "97214", "97215"],
                streets: ["SE Hawthorne Blvd", "SE Division St", "SE Belmont St", "SE Stark St",
                  "SE Powell Blvd", "SE Woodstock Blvd", "SE Foster Rd", "SE Milwaukie Ave", "SE Clinton St"]
              }
            ]
          },
          {
            name: "Salem",
            zh: "塞勒姆",
            areaCodes: ["503", "971"],
            num: [100, 4999],
            zones: [{
              zips: ["97301", "97302", "97305", "97306"],
              streets: ["Commercial St SE", "Liberty St SE", "Mission St SE", "12th St SE", "Lancaster Dr NE",
                "Center St NE", "Market St NE", "State St", "Silverton Rd NE", "Portland Rd NE"]
            }]
          },
          {
            name: "Eugene",
            zh: "尤金",
            areaCodes: ["541", "458"],
            num: [100, 3999],
            zones: [{
              zips: ["97401", "97402", "97403", "97404", "97405", "97408"],
              streets: ["Willamette St", "Coburg Rd", "River Rd", "W 11th Ave", "W 18th Ave", "Franklin Blvd",
                "Pearl St", "Oak St", "High St", "Alder St", "E 13th Ave", "Hilyard St", "Chambers St"]
            }]
          },
          {
            name: "Beaverton",
            zh: "比弗顿",
            areaCodes: ["503", "971"],
            num: [1000, 19999],
            zones: [{
              zips: ["97005", "97006", "97007", "97008"],
              streets: ["SW Canyon Rd", "SW Murray Blvd", "SW Allen Blvd", "SW Hall Blvd", "SW Farmington Rd",
                "SW Cedar Hills Blvd", "SW Walker Rd", "SW Scholls Ferry Rd", "SW Jenkins Rd", "SW Millikan Way"]
            }]
          },
          {
            name: "Hillsboro",
            zh: "希尔斯伯勒",
            areaCodes: ["503", "971"],
            num: [100, 4999],
            zones: [{
              zips: ["97123", "97124"],
              streets: ["E Main St", "NE Cornell Rd", "SE Tualatin Valley Hwy", "NE Brookwood Pkwy",
                "NE 25th Ave", "SE Oak St", "NE Grant St"]
            }]
          },
          {
            name: "Gresham",
            zh: "格雷舍姆",
            areaCodes: ["503", "971"],
            num: [100, 3999],
            zones: [{
              zips: ["97030", "97080"],
              streets: ["SE Stark St", "NW Division St", "NE 181st Ave", "SE 182nd Ave", "NW Eastman Pkwy",
                "W Powell Blvd"]
            }]
          },
          {
            name: "Tigard",
            zh: "泰格德",
            areaCodes: ["503", "971"],
            num: [8000, 16999],
            zones: [{
              zips: ["97223", "97224"],
              streets: ["SW Pacific Hwy", "SW Hall Blvd", "SW Greenburg Rd", "SW Durham Rd", "SW Scholls Ferry Rd",
                "SW Bonita Rd", "SW Gaarde St", "SW Main St"]
            }]
          },
          {
            name: "Lake Oswego",
            zh: "奥斯威戈湖",
            areaCodes: ["503", "971"],
            num: [100, 4999],
            zones: [{
              zips: ["97034", "97035"],
              streets: ["A Ave", "B Ave", "State St", "Boones Ferry Rd", "Country Club Rd", "Kruse Way",
                "Jean Rd", "McVey Ave", "Lakeview Blvd"]
            }]
          },
          {
            name: "Tualatin",
            zh: "图拉丁",
            areaCodes: ["503", "971"],
            num: [5000, 23999],
            zones: [{
              zips: ["97062"],
              streets: ["SW Tualatin Sherwood Rd", "SW Boones Ferry Rd", "SW Nyberg St", "SW Martinazzi Ave",
                "SW Avery St", "SW 65th Ave"]
            }]
          },
          {
            name: "Bend",
            zh: "本德",
            areaCodes: ["541", "458"],
            num: [100, 3999],
            zones: [{
              zips: ["97701", "97702", "97703"],
              streets: ["NE 3rd St", "NW Wall St", "NW Bond St", "NE Greenwood Ave", "SW Century Dr",
                "NE 27th St", "NW Newport Ave", "SE Reed Market Rd", "NW Galveston Ave"]
            }]
          },
          {
            name: "Medford",
            zh: "梅德福",
            areaCodes: ["541", "458"],
            num: [100, 3999],
            zones: [{
              zips: ["97501", "97504"],
              streets: ["E Main St", "W Main St", "Crater Lake Ave", "E Barnett Rd", "N Riverside Ave",
                "S Central Ave", "Biddle Rd", "E Jackson St", "Stewart Ave"]
            }]
          },
          {
            name: "Corvallis",
            zh: "科瓦利斯",
            areaCodes: ["541", "458"],
            num: [100, 3999],
            zones: [{
              zips: ["97330", "97333"],
              streets: ["NW Monroe Ave", "SW Jefferson Ave", "NW Kings Blvd", "NW Harrison Blvd",
                "NW Walnut Blvd", "NE Circle Blvd", "NW 9th St", "SW 3rd St"]
            }]
          },
          {
            name: "Springfield",
            zh: "斯普林菲尔德",
            areaCodes: ["541", "458"],
            num: [100, 5999],
            zones: [{
              zips: ["97477", "97478"],
              streets: ["Main St", "Gateway St", "Olympic St", "Mohawk Blvd", "Q St", "Pioneer Pkwy",
                "Harlow Rd"]
            }]
          }
        ]
      },
      {
        code: "DE",
        name: "Delaware",
        zh: "特拉华州",
        recommended: true,
        tax: "全州无销售税，电话区号统一为 302，同样是最常用的选择。",
        cities: [
          {
            name: "Wilmington",
            zh: "威尔明顿",
            areaCodes: ["302"],
            num: [100, 3999],
            zones: [
              {
                zips: ["19801", "19802", "19805", "19806"],
                num: [100, 2499],
                streets: ["N Market St", "N King St", "Delaware Ave", "Pennsylvania Ave", "Lancaster Ave",
                  "N Union St", "W 4th St", "N Washington St", "Maryland Ave", "W 9th St"]
              },
              {
                zips: ["19803", "19809", "19810"],
                streets: ["Concord Pike", "Foulk Rd", "Silverside Rd", "Naamans Rd", "Philadelphia Pike",
                  "Marsh Rd", "Shipley Rd"]
              },
              {
                zips: ["19804", "19808"],
                streets: ["Kirkwood Hwy", "Limestone Rd", "Milltown Rd", "Duncan Rd", "Centerville Rd",
                  "Old Capitol Trl"]
              }
            ]
          },
          {
            name: "Dover",
            zh: "多佛",
            areaCodes: ["302"],
            num: [100, 2999],
            zones: [{
              zips: ["19901", "19904"],
              streets: ["S State St", "N DuPont Hwy", "Loockerman St", "Forrest Ave", "W North St", "Kings Hwy",
                "S Governors Ave", "Bay Rd", "College Rd", "White Oak Rd"]
            }]
          },
          {
            name: "Newark",
            zh: "纽瓦克",
            areaCodes: ["302"],
            num: [100, 2999],
            zones: [{
              zips: ["19702", "19711", "19713"],
              streets: ["E Main St", "Elkton Rd", "S College Ave", "Library Ave", "Chapman Rd", "Old Baltimore Pike",
                "Ogletown Rd", "Marrows Rd", "Polly Drummond Hill Rd", "Paper Mill Rd", "Barksdale Rd"]
            }]
          },
          {
            name: "Middletown",
            zh: "米德尔敦",
            areaCodes: ["302"],
            num: [100, 1999],
            zones: [{
              zips: ["19709"],
              streets: ["W Main St", "N Broad St", "Cedar Lane Rd", "Bunker Hill Rd", "Levels Rd",
                "Summit Bridge Rd", "Boyds Corner Rd"]
            }]
          },
          {
            name: "Bear",
            zh: "贝尔",
            areaCodes: ["302"],
            num: [100, 2999],
            zones: [{
              zips: ["19701"],
              streets: ["Red Lion Rd", "Pulaski Hwy", "Wrangle Hill Rd", "Bear Christiana Rd", "Porter Rd",
                "Denny Rd", "Songsmith Dr"]
            }]
          },
          {
            name: "New Castle",
            zh: "纽卡斯尔",
            areaCodes: ["302"],
            num: [100, 1999],
            zones: [{
              zips: ["19720"],
              streets: ["Delaware St", "Basin Rd", "Christiana Rd", "N DuPont Hwy", "Frenchtown Rd",
                "Old Churchmans Rd"]
            }]
          },
          {
            name: "Hockessin",
            zh: "霍克辛",
            areaCodes: ["302"],
            num: [100, 1999],
            zones: [{
              zips: ["19707"],
              streets: ["Lancaster Pike", "Old Lancaster Pike", "Valley Rd", "Yorklyn Rd", "Limestone Rd",
                "Old Wilmington Rd", "Mill Creek Rd"]
            }]
          },
          {
            name: "Smyrna",
            zh: "士麦那",
            areaCodes: ["302"],
            num: [10, 999],
            zones: [{
              zips: ["19977"],
              streets: ["S DuPont Blvd", "W Commerce St", "E Commerce St", "S Main St", "N Main St", "Glenwood Ave"]
            }]
          },
          {
            name: "Milford",
            zh: "米尔福德",
            areaCodes: ["302"],
            num: [10, 999],
            zones: [{
              zips: ["19963"],
              streets: ["N Walnut St", "S Walnut St", "NE Front St", "SE Front St", "Rehoboth Blvd",
                "N DuPont Blvd", "Lakeview Ave"]
            }]
          },
          {
            name: "Lewes",
            zh: "刘易斯",
            areaCodes: ["302"],
            num: [100, 1999],
            zones: [{
              zips: ["19958"],
              streets: ["Savannah Rd", "Kings Hwy", "Front St", "2nd St", "Freeman Hwy", "Gills Neck Rd",
                "Pilottown Rd", "New Rd", "Plantation Rd"]
            }]
          },
          {
            name: "Rehoboth Beach",
            zh: "里霍博斯海滩",
            areaCodes: ["302"],
            num: [10, 999],
            zones: [{
              zips: ["19971"],
              streets: ["Rehoboth Ave", "Coastal Hwy", "Bayard Ave", "Columbia Ave", "Lake Ave", "Wilmington Ave",
                "Olive Ave"]
            }]
          },
          {
            name: "Georgetown",
            zh: "乔治敦",
            areaCodes: ["302"],
            num: [10, 999],
            zones: [{
              zips: ["19947"],
              streets: ["E Market St", "W Market St", "N Bedford St", "S Bedford St", "N Race St", "DuPont Blvd"]
            }]
          },
          {
            name: "Seaford",
            zh: "锡福德",
            areaCodes: ["302"],
            num: [10, 999],
            zones: [{
              zips: ["19973"],
              streets: ["High St", "Stein Hwy", "Sussex Hwy", "Market St", "Pine St"]
            }]
          }
        ]
      },
      {
        code: "MT",
        name: "Montana",
        zh: "蒙大拿州",
        recommended: false,
        tax: "无州销售税。少数度假区（如 Whitefish、Big Sky、West Yellowstone）征收地方度假税，本工具已排除这些地区。",
        cities: [
          {
            name: "Billings",
            zh: "比林斯",
            areaCodes: ["406"],
            num: [100, 4999],
            zones: [
              {
                zips: ["59101"],
                streets: ["1st Ave N", "2nd Ave N", "N 27th St", "Montana Ave", "N 32nd St", "S Billings Blvd"]
              },
              {
                zips: ["59102", "59106"],
                streets: ["Grand Ave", "Central Ave", "24th St W", "Rimrock Rd", "Poly Dr", "Broadwater Ave",
                  "King Ave W", "Shiloh Rd", "Zimmerman Trl"]
              },
              {
                zips: ["59105"],
                streets: ["Main St", "Bench Blvd", "Lake Elmo Dr", "Wicks Ln", "Hilltop Rd"]
              }
            ]
          },
          {
            name: "Missoula",
            zh: "米苏拉",
            areaCodes: ["406"],
            num: [100, 3999],
            zones: [{
              zips: ["59801", "59802", "59803", "59804", "59808"],
              streets: ["N Higgins Ave", "S Higgins Ave", "Brooks St", "S Reserve St", "W Broadway St", "Russell St",
                "Mount Ave", "Stephens Ave", "Orange St", "S 3rd St W"]
            }]
          },
          {
            name: "Bozeman",
            zh: "博兹曼",
            areaCodes: ["406"],
            num: [100, 3999],
            zones: [{
              zips: ["59715", "59718"],
              streets: ["E Main St", "W Main St", "N 7th Ave", "N 19th Ave", "S Willson Ave", "W College St",
                "W Babcock St", "N Rouse Ave", "W Oak St", "Durston Rd", "Kagy Blvd"]
            }]
          },
          {
            name: "Great Falls",
            zh: "大瀑布城",
            areaCodes: ["406"],
            num: [100, 3999],
            zones: [{
              zips: ["59401", "59404", "59405"],
              streets: ["Central Ave", "10th Ave S", "1st Ave N", "2nd Ave N", "River Dr N", "6th St SW",
                "Smelter Ave NE", "Park Dr S"]
            }]
          },
          {
            name: "Helena",
            zh: "海伦娜",
            areaCodes: ["406"],
            num: [100, 2999],
            zones: [{
              zips: ["59601", "59602"],
              streets: ["N Last Chance Gulch", "Fuller Ave", "N Montana Ave", "Euclid Ave", "Prospect Ave",
                "N Sanders St", "Broadway St", "Cedar St", "Custer Ave", "Lyndale Ave", "N Benton Ave"]
            }]
          },
          {
            name: "Butte",
            zh: "比尤特",
            areaCodes: ["406"],
            num: [100, 3999],
            zones: [{
              zips: ["59701"],
              streets: ["Harrison Ave", "W Park St", "S Montana St", "Dewey Blvd", "Continental Dr", "Grand Ave",
                "W Broadway St", "N Main St"]
            }]
          },
          {
            name: "Kalispell",
            zh: "卡利斯佩尔",
            areaCodes: ["406"],
            num: [100, 1999],
            zones: [{
              zips: ["59901"],
              streets: ["N Main St", "S Main St", "W Idaho St", "E Idaho St", "N Meridian Rd", "1st Ave E",
                "Two Mile Dr", "Woodland Ave"]
            }]
          }
        ]
      },
      {
        code: "NH",
        name: "New Hampshire",
        zh: "新罕布什尔州",
        recommended: false,
        tax: "无一般销售税（仅对餐饮、住宿、租车征税，不影响 App Store 消费）。",
        cities: [
          {
            name: "Manchester",
            zh: "曼彻斯特",
            areaCodes: ["603"],
            num: [10, 1999],
            zones: [{
              zips: ["03101", "03102", "03103", "03104", "03109"],
              streets: ["Elm St", "Hanover St", "Maple St", "S Willow St", "Bridge St", "Lake Ave", "Wilson St",
                "Valley St", "Mammoth Rd", "Candia Rd", "Beech St", "Chestnut St", "Union St", "Granite St"]
            }]
          },
          {
            name: "Nashua",
            zh: "纳舒厄",
            areaCodes: ["603"],
            num: [10, 999],
            zones: [{
              zips: ["03060", "03062", "03063", "03064"],
              streets: ["Main St", "Amherst St", "Daniel Webster Hwy", "Broad St", "W Hollis St", "Kinsley St",
                "Spit Brook Rd", "Concord St", "Lake St", "Pine St"]
            }]
          },
          {
            name: "Concord",
            zh: "康科德",
            areaCodes: ["603"],
            num: [10, 999],
            zones: [{
              zips: ["03301", "03303"],
              streets: ["N Main St", "S Main St", "Loudon Rd", "Fort Eddy Rd", "Pleasant St", "School St",
                "Warren St", "Centre St", "N State St", "S State St", "Clinton St", "Manchester St"]
            }]
          },
          {
            name: "Portsmouth",
            zh: "朴茨茅斯",
            areaCodes: ["603"],
            num: [10, 1999],
            zones: [{
              zips: ["03801"],
              streets: ["Market St", "Congress St", "State St", "Islington St", "Middle St", "Pleasant St",
                "Lafayette Rd", "Woodbury Ave", "Maplewood Ave", "Daniel St"]
            }]
          },
          {
            name: "Dover",
            zh: "多佛",
            areaCodes: ["603"],
            num: [10, 999],
            zones: [{
              zips: ["03820"],
              streets: ["Central Ave", "Washington St", "Silver St", "Locust St", "Broadway", "Sixth St"]
            }]
          },
          {
            name: "Rochester",
            zh: "罗切斯特",
            areaCodes: ["603"],
            num: [10, 999],
            zones: [{
              zips: ["03867", "03868"],
              streets: ["N Main St", "S Main St", "Wakefield St", "Portland St", "Charles St", "Highland St",
                "Washington St", "Milton Rd"]
            }]
          },
          {
            name: "Salem",
            zh: "塞勒姆",
            areaCodes: ["603"],
            num: [10, 499],
            zones: [{
              zips: ["03079"],
              streets: ["S Broadway", "N Broadway", "Main St", "Lawrence Rd", "Pelham Rd"]
            }]
          },
          {
            name: "Keene",
            zh: "基恩",
            areaCodes: ["603"],
            num: [10, 699],
            zones: [{
              zips: ["03431"],
              streets: ["Main St", "West St", "Court St", "Washington St", "Marlboro St", "Winchester St",
                "Park Ave", "Maple Ave", "Roxbury St"]
            }]
          },
          {
            name: "Hanover",
            zh: "汉诺威",
            areaCodes: ["603"],
            num: [1, 199],
            zones: [{
              zips: ["03755"],
              streets: ["Main St", "Lebanon St", "Wheelock St", "S Park St", "Allen St", "Lyme Rd"]
            }]
          },
          {
            name: "Exeter",
            zh: "埃克塞特",
            areaCodes: ["603"],
            num: [1, 299],
            zones: [{
              zips: ["03833"],
              streets: ["Water St", "Front St", "High St", "Portsmouth Ave", "Lincoln St", "Court St", "Epping Rd"]
            }]
          },
          {
            name: "Derry",
            zh: "德里",
            areaCodes: ["603"],
            num: [1, 299],
            zones: [{
              zips: ["03038"],
              streets: ["E Broadway", "W Broadway", "Birch St", "Crystal Ave", "Rockingham Rd", "Island Pond Rd",
                "Chester Rd"]
            }]
          },
          {
            name: "Merrimack",
            zh: "梅里马克",
            areaCodes: ["603"],
            num: [1, 699],
            zones: [{
              zips: ["03054"],
              streets: ["Daniel Webster Hwy", "Baboosic Lake Rd", "Continental Blvd", "Amherst Rd",
                "Camp Sargent Rd", "Bedford Rd", "Naticook Rd"]
            }]
          }
        ]
      },
      {
        code: "AK",
        name: "Alaska",
        zh: "阿拉斯加州",
        recommended: false,
        tax: "无州销售税，但很多城市征收地方销售税。本工具只使用无地方销售税的 Anchorage（含 Eagle River）和 Fairbanks。",
        cities: [
          {
            name: "Anchorage",
            zh: "安克雷奇",
            areaCodes: ["907"],
            num: [100, 4999],
            zones: [
              {
                zips: ["99501"],
                num: [100, 1499],
                streets: ["W 4th Ave", "W 5th Ave", "E 5th Ave", "W 6th Ave", "C St", "A St", "E St", "K St", "L St"]
              },
              {
                zips: ["99503"],
                streets: ["W Benson Blvd", "E Northern Lights Blvd", "W Northern Lights Blvd", "Spenard Rd", "C St",
                  "A St", "E Tudor Rd", "Old Seward Hwy", "Arctic Blvd"]
              },
              {
                zips: ["99504", "99508"],
                streets: ["Muldoon Rd", "DeBarr Rd", "Boniface Pkwy", "Patterson St", "E Northern Lights Blvd",
                  "Lake Otis Pkwy", "E Tudor Rd", "Bragaw St", "E 36th Ave", "Providence Dr"]
              },
              {
                zips: ["99502", "99517"],
                streets: ["Jewel Lake Rd", "Raspberry Rd", "Sand Lake Rd", "Northwood Dr", "Wisconsin St",
                  "Spenard Rd", "W Northern Lights Blvd", "W International Airport Rd"]
              },
              {
                zips: ["99507", "99515", "99516", "99518"],
                num: [100, 14999],
                streets: ["Abbott Rd", "E Dimond Blvd", "W Dimond Blvd", "Lake Otis Pkwy", "Huffman Rd",
                  "Old Seward Hwy", "Minnesota Dr", "C St", "W 88th Ave", "Klatt Rd", "Elmore Rd"]
              }
            ]
          },
          {
            name: "Eagle River",
            zh: "伊格尔河（属安克雷奇市）",
            areaCodes: ["907"],
            num: [10000, 22999],
            zones: [{
              zips: ["99577"],
              streets: ["Old Glenn Hwy", "Eagle River Rd", "Eagle River Loop Rd", "Business Blvd", "Artillery Rd"]
            }]
          },
          {
            name: "Fairbanks",
            zh: "费尔班克斯",
            areaCodes: ["907"],
            num: [100, 3999],
            zones: [
              {
                zips: ["99701"],
                streets: ["Cushman St", "Airport Way", "Noble St", "Lacey St", "Gaffney Rd", "Johansen Expy"]
              },
              {
                zips: ["99709"],
                streets: ["University Ave", "Geist Rd", "College Rd", "Chena Pump Rd", "Peger Rd"]
              },
              {
                zips: ["99712"],
                streets: ["Farmers Loop Rd", "Steese Hwy", "Chena Hot Springs Rd"]
              }
            ]
          }
        ]
      }
    ],

    firstNames: {
      male: ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles",
        "Daniel", "Matthew", "Anthony", "Mark", "Steven", "Paul", "Andrew", "Joshua", "Kevin", "Brian",
        "George", "Timothy", "Ryan", "Jason", "Eric", "Jacob", "Nicholas", "Tyler", "Aaron", "Adam",
        "Nathan", "Kyle", "Ethan", "Benjamin", "Samuel", "Gregory", "Patrick", "Jack", "Dylan", "Logan"],
      female: ["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah",
        "Karen", "Emily", "Nancy", "Lisa", "Betty", "Ashley", "Kimberly", "Michelle", "Amanda", "Melissa",
        "Stephanie", "Rebecca", "Laura", "Emma", "Olivia", "Hannah", "Rachel", "Megan", "Lauren", "Grace",
        "Natalie", "Samantha", "Victoria", "Abigail", "Madison", "Chloe", "Julia", "Katherine", "Anna", "Sophia", "Claire"]
    },
    lastNames: ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Wilson", "Anderson", "Taylor",
      "Thomas", "Moore", "Martin", "Jackson", "Thompson", "White", "Harris", "Clark", "Lewis", "Robinson",
      "Walker", "Young", "Allen", "King", "Wright", "Scott", "Hill", "Green", "Adams", "Baker",
      "Nelson", "Carter", "Mitchell", "Roberts", "Turner", "Phillips", "Campbell", "Parker", "Evans", "Edwards",
      "Collins", "Stewart", "Morris", "Murphy", "Cook", "Rogers", "Morgan", "Cooper", "Peterson", "Reed",
      "Bailey", "Bell", "Howard", "Ward", "Cox", "Richardson", "Wood", "Watson", "Brooks", "Bennett"]
  };

  if (typeof module === "object" && module.exports) {
    module.exports = DATA;
  } else {
    root.TAX_FREE_DATA = DATA;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
