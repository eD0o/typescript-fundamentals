// //* JSON types
// /*
// A JSON value MUST be an
//   · object
//   · array
//   · number
//   · string,
// or one of the following three literal names:
//   · false
//   · true
//   · null
// */

// type JSONPrimitve = string | number | boolean | null
// /**
//  * A JSON object type   {    }
//  */
// type JSONObject = { [key: string]: JSONValue }
// /**
//  * A JSON array type   [    ]
//  */
// type JSONArray = JSONValue[]
// /**
//  * A type representing any valid JSON value
//  */
// type JSONValue = JSONPrimitve | JSONObject | JSONArray

// //! DO NOT EDIT ANY CODE BELOW THIS LINE
// function isJSON(arg: JSONValue) { }

// //✔️ POSITIVE test cases (must pass)
// isJSON('hello')
// isJSON([4, 8, 15, 16, 23, 42])
// isJSON({ greeting: 'hello' })
// isJSON(false)
// isJSON(true)
// isJSON(null)
// isJSON({ a: { b: [2, 3, 'foo', null, false] } })

// //! NEGATIVE test cases (must fail)
// //// @ts-expect-error
// isJSON(() => '') //! Functions are not valid JSON
// //// @ts-expect-error
// isJSON(class { }) //! Classes are not valid JSON
// //// @ts-expect-error
// isJSON(undefined) //! undefined is not valid JSON
// //// @ts-expect-error
// isJSON(BigInt(143)) //! BigInts are not valid JSON
