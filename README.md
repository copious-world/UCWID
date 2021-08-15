# UCWID

 A distributed identity base on two **CWID**s and other information.
 
 **UCWUID** stands for ***Ultimate*** **CWID**.

## The Module Code Purpose

This code is separated out into a module of its own, in order to make it accessible and customizable. 

In the explanation below, there are some details as to how a **UCWID** may be constructed. The function that *marries* **CWID**s together will require two **CWID**s and may use other information. It suffices to say that the function is variable, and that any such function may enclose other data requirements, including such things as a version number addressing data preparation prior to encryption, the kind of encryption, the kind of hashing, etc.

Requirements on **UCWID** production functions will be defined. For now, let us expect that the **UCWID** will extend the prefixing of a **CWID**. So, that string representing a **UCWID** contains is a tripple demitted by an *exclamation point*, **!**.  The format will be as such:

```
<data prep keys>!<base encoding and hashing keys>!<encode hash of data>
```

## Content Identity

Clear content will be normalized and hashed to produce a **CWID**. Then, the content will be encrypted and another **CWID** produced for the encrypted content. Utimately, these two identities will be married together in a package with some other information resulting in a **UCWID**.  *(Think of Euclid.)*

### Two CWIDs per Content String

Those prefering to maintain content integrity will only ever store the encrypted content within a Peer to Peer (P2P) file system. Yet, each encryption is unique. So, there is a need to limit cryptographic copies to a minimal number (meaning different encryptions of the same content).

To that effect, methods are provided here that make it easy to associate a ***clear CWID*** with a ***crypto CWID***. Using the methods, some combination of the two **CWID**s will be produced and a **CWID** will be derived from it.

That is, given a combiner function **C**, a **CWID** will be made from the value returned from **C**(***clear CWID***, ***crypto CWID***).  E.g.

```
 UCWID = C(clear_CWID, crypto_CWID) // an Ultimate CWID
```

While this module will not establish a registery of **UCWUID**s, it will generate them in such a way that they may be placed in a registry.

## How to Use


## Exposed Methods

