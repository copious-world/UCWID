# UCWID

 A distributed identity base on two **CWID**s and other information.
 
 **UCWUID** stands for ***Ultimate*** **CWID**.

## The Module Code Purpose

This code is separated out into a module of its own, in order to make it accessible and customizable. 

In the explanation below, there are some details as to how a **UCWID** may be contstucted. The function that *marries* will require two **CWID**s and may use other information. It suffices to say that the function is variable, and that one of these such functions may enclose other data requirements, including a version number addressing data preparation prior to encryption, the kind of encryption, the kind of hashing, etc.

Requirements on **UCWID** production functions will be defined. For now, let us expect that the **UCWID** will extend the prefixing of a **CWID**. So, that string representing a **UCWID** contains is a tripple delmitted by an *exclamation point*, **!**.  The format will be as such:

```
<data prep keys>!<base encoding and hashing keys>!<encode hash of data>
```


## Content Identity

Clear content will be normalized and hashed to produce a **CWID**. Then, the content will be encrypted and another **CWID** produced for the encrypted content. Utimately, these two identities will be married together in a package with some other information resulting in a **UCWID**.  *(Think of Euclid.)*

### Two CWIDs per Content String

Those prefering to maintain content integrity will only ever store the encrypted content within a Peer to Peer (P2P) file system. Yet, each encryption is unique. So, there is a need to limit cryptographic copies to a minimal number (meaning different encryptions of the same content).

To that affect, methods are provided here  that make it easy to associate a ***clear CWID*** with a ***crypto CWID***. Using the methods, some combination of the two CWIDs will be produced and a CWID will be derived from it.

That is, given a combiner function **C**, a **CWID** will be made from the value returned from **C**(***clear CWID***, ***crypto CWID***).  E.g.

```
 UCWID = C(clear_CWID, crypto_CWID) // an Ultimate CWID
```

While this module will not establish a registery of **UCWUID**s, it will generate them in such a way that they may be placed in a registry.

## DID formation

In this version, the data that is returned by the `ucwid` method includes a DID foratted field, 'did'. Internally, `ucwid_constructor` calls the CWID method `cwid_to_did`.

```
{
		"ucwid" : u_cwid,
		"did" : u_cwid_did,
		"info" : {
				"ucwid_packet" : ucwid_packet = {
		            "clear_cwid" : clear_cwid,
		            "crypto_cwid" : crypto_cwid
		        },
				"wrapped_key" : wrapped_key,
				"nonce" : nonce,
				"cipher_text" : cipher_text,
				"type_original" : normalize ? "string" : "buffer"
   		}}
```

In future versions, the DID document will be derived from included data.



## How to Use

This module may be used in node.js or in the browser. The usage in the browser has just one different step for initialization than the node.js server side (or desktop) code. Remote loading, lazy loading, of support modules into the browser is expected.

Here is example code taken from the tests. First, node.js, then the browser:

* node.js code

```
	let UCWID = require('ucwid')
	//
	let ucwid_gen = new UCWID({})  the generator
	//
	let [key_wait,key_promise] = ucwid_service.wait_for_key()
	if ( key_wait ) {
	    await key_promise
	}
	//
	for ( let i = 1; i < N_big; i++ ) {
		let data = "this is a test" + i
		
		let my_ucwid = await ucwid_gen.ucwid(data)
		
		console.dir(my_ucwid)
	}
	
	await store_keys(ucwid_gen.key_package())
```

* browser code

```
	import {UCWID}  from "../client/UCWID.js"
	(async () => {
		let ucwid_gen = new UCWID({})
		let [normalizer_wait,normalizer_promise] = ucwid_gen.wait_for_normalizer()
		if ( normalizer_wait ) {
			await normalizer_promise
		}
		let [key_wait,key_promise] = ucwid_gen.wait_for_key()
		if ( key_wait ) {
			await key_promise
		}

		for ( let i = 1; i < N_big; i++ ) {
			let data = "this is a test" + i
			
			let my_ucwid = await ucwid_gen.ucwid(data)
			
			let printable = `
			<code>
				${JSON.stringify(my_ucwid,null,2)}
			</code>
			`
			document.write(printable)
		}
		await store_keys(ucwid_gen.key_package())

```

### Normalizer

A normalier is a class with a few required methods. The purpose of the normalizer is to standardize as much as possible the data that is passed to the *ucwid* method. In theory a normalizer, supplied by the application will transorm data that is passed to it, and save any amount of data generated in the analysis of that data in order to provide topicalization and meta data and make the data uniquely identifiable.

So that an application may provide a normalizer class to the **UCWID** generator, a field is called out in the configuration parameter of the constructore.

```
	let ucwid_gen = new UCWID({
		normalizer : "location of module",
		class_name : "normalizer class name"
	})
```

In node.js, the normalizer is passed to *require*. In the browser, the normalizer is loaded lazily as such:

```
    const moduleSpecifier = conf.normalize;
    const module = await import(moduleSpecifier)
    const Normal = module[conf.class_name]
    this.normalizer = new Normal(conf)
```

The normalizer is something that may be supplied by the application. The default normalizer is unity. That is, it returns the data that is passed to it unchanged.

Here is the normalizer base class:

```
export class BaseNormalizer {
    constructor(conf) {
    }

    normalize(data) {
        throw new Error("BaseNormalizer method normalize in UCWID stack requires descendant implementation")
    }

    version() {
        throw new Error("BaseNormalizer method version in UCWID stack requires descendant implementation")
    }
}

```

The version method returns the short hex string indicating the kind of normalizer and the impelentation version. The first two hex bytes are the class number, the second two are the implementation verion.

For *unity*, the version method returns "0101". See the file, ***normalizers.json*** in the directory */asset*. (Note: ***asset*** is not to be confused with ***assets***, which is introduced by the installation scripts in ***./tools***.)

## Exposed Methods

* **constructor(conf)**
> The constructor is the standard JavaScript constructor that takes a configuration object. The result of `new UCWID(conf)` produces a **UCWID** factory, allowing **UCWID**s to be generated by calls to the **ucwid** method.

* **wait\_for\_normalizer()**  : Html client only
> When a **UCWID** object is created in the HTML client, the module code will load the application normalizer. Since, this is a lazy loading operation, the application might race ahead. Call this method to get both a flag indicating whether or not to wait, and a promise to wait on if waiting is required.
> `[do_wait,waiting_promise] = ucwid_producer.wait_for_normalizer()`

* **wait\_for\_key()**
> When a **UCWID** object is created in either, the module code may generate application key pairs if none has been given in the configuration or if the configuration calls for it. Since, this is an async operation, the application might race ahead. Call this method to get both a flag indicating whether or not to wait, and a promise to wait on if waiting is required.
> `[do_wait,waiting_promise] = ucwid_producer.wait_for_key()`

* **key\_package()**
> If the configuration does not supply a public wrapper key or if the application call *provide\_keys* then the application should retrieve the keys and put them where they belong. Call this method to get the keys as a structure.
```
{
	pk_str : "the public wrapper key",
	priv_key : "the private wrapper key"
}
```

* **async provide\_keys()**
> Call this method to generate a public/private wrapper key pair. The method, *key\_package()*, will continue to return the same that this method generates, until this method is called again.

* **ucwid(data)**
> This method generates the **UCWID** identifier. It returns a structure containing the **UCWID** as well as a field containing the encryption of the *data* and the crypto parameteres.
> 
```
{
		"ucwid" : u_cwid,
		"did" : u_cwid_did,
		"info" : {
				"ucwid_packet" : ucwid_packet = {
		            "clear_cwid" : clear_cwid,
		            "crypto_cwid" : crypto_cwid
		        },
				"wrapped_key" : wrapped_key,
				"nonce" : nonce,
				"cipher_text" : cipher_text,
				"type_original" : normalize ? "string" : "buffer"
   		}}
```
The application should preserve and utilize the information in this structure. For example, the application might want to reproduce the clear\_cwid when clear text is obtained, or the crypto\_cwid when the enciphered data is received. A consumer of the clear data will need to unwrap the AES key in order to decipher it. 
