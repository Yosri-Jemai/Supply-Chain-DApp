"use client";

import React, { useState, useEffect } from "react";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import Tracking from "../Context/Tracking.json";

const ContractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const ContractABI = Tracking.abi;

// Provider allows us to read data from the blockchain
// Signer allows us to interact/write data to the blockchain
const fetchContract = (signerOrProvider) => {
    return new ethers.Contract(
        ContractAddress,
        ContractABI,
        signerOrProvider
    );
};

export const TrackingContext = React.createContext();

export const TrackingProvider = ({ children }) => {
    const title = "Product Tracking Dapp";
    const [currentUser, setCurrentUser] = useState("");

    const createShipment = async (items) => {
        console.log(items);
        const { receiver, pickupTime, distance, price } = items;
        try {
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.BrowserProvider(connection);
            const signer = await provider.getSigner();
            const contract = fetchContract(signer);
            const pickupTimestamp = Math.floor(
                new Date(pickupTime).getTime() / 1000
            );
            const priceInWei = ethers.parseUnits(
                price.toString(),
                18
            );
            const createItem = await contract.createShipment(
                receiver,
                pickupTimestamp,
                distance,
                priceInWei,
                {
                    value: priceInWei
                }
            );
            await createItem.wait();
            console.log(createItem);
        } catch (error) {
            console.log(
                "Error while creating shipment:",
                error
            );
        }
    };

    const getAllShipments = async () => {
        try {
            const provider = new ethers.JsonRpcProvider();
            const contract = fetchContract(provider);
            const shipments = await contract.getAllShipments();
            const allShipments = shipments.map((shipment) => ({
                sender: shipment.sender,
                receiver: shipment.receiver,

                price: ethers.formatEther(
                    shipment.price.toString()
                ),
                pickupTime: Number(shipment.pickupTime),
                deliveryTime: Number(shipment.deliveryTime),
                distance: Number(shipment.distance),
                isPaid: shipment.isPaid,
                status: Number(shipment.status)
            }));
            return allShipments;
        } catch (error) {
            console.log(
                "Error while fetching shipments:",
                error
            );
        }
    };

    const getShipmentsCount = async () => {
        try {
            if (!window.ethereum) {
                return alert("Please install MetaMask.");
            }
            const accounts = await window.ethereum.request({
                method: "eth_accounts"
            });
            const provider = new ethers.BrowserProvider(
                window.ethereum
            );
            const contract = fetchContract(provider);
            // Account that is connected to the DApp
            const shipmentsCount =
                await contract.getShipmentsCount(accounts[0]);
            return Number(shipmentsCount);
        } catch (error) {
            console.log(
                "Error while fetching shipments count:",
                error
            );
        }
    };

    const completeShipment = async (completeShipmentData) => {
        console.log(
            "Completing shipment: ",
            completeShipmentData
        );
        const { receiver, index } = completeShipmentData;
        try {
            if (!window.ethereum) {
                return alert("Please install MetaMask.");
            }
            const accounts = await window.ethereum.request({
                method: "eth_accounts"
            });
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.BrowserProvider(
                connection
            );
            const signer = await provider.getSigner();
            const contract = fetchContract(signer);
            const completeShipmentTx =
                await contract.completeShipment(
                    accounts[0],
                    receiver,
                    index,
                    {
                        gasLimit: 300000
                    }
                );
            await completeShipmentTx.wait();
            console.log(
                "Shipment completed successfully:",
                completeShipmentTx
            );
        } catch (error) {
            console.log(
                "Error while completing shipment:",
                error
            );
        }
    };

    const getShipment = async (index) => {
        console.log(
            "Fetching shipment at index: ",
            index
        );
        try {
            if (!window.ethereum) {
                return alert("Please install MetaMask.");
            }
            const accounts = await window.ethereum.request({
                method: "eth_accounts"
            });
            const provider = new ethers.JsonRpcProvider();
            const contract = fetchContract(provider);
            const shipment = await contract.getShipment(
                accounts[0],
                Number(index)
            );
            const singleShipment = {
                sender: shipment[0],
                receiver: shipment[1],
                pickupTime: Number(shipment[2]),
                deliveryTime: Number(shipment[3]),
                distance: Number(shipment[4]),
                price: ethers.formatEther(
                    shipment[5].toString()
                ),
                status: Number(shipment[6]),
                isPaid: shipment[7]
            };
            console.log(
                "Fetched shipment:",
                shipment
            );
            return singleShipment;
        } catch (error) {
            console.log(
                "Error while fetching shipment:",
                error
            );
        }
    };

    const startShipment = async (startShipmentData) => {
        console.log(
            "Starting shipment: ",
            startShipmentData
        );
        const { receiver, index } = startShipmentData;
        try {
            if (!window.ethereum) {
                return alert("Please install MetaMask.");
            }
            const accounts = await window.ethereum.request({
                method: "eth_accounts"
            });
            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();
            const provider = new ethers.BrowserProvider(
                connection
            );
            const signer = await provider.getSigner();
            const contract = fetchContract(signer);
            const startShipmentTx =
                await contract.startShipment(
                    accounts[0],
                    receiver,
                    index,
                    {
                        gasLimit: 300000
                    }
                );
            await startShipmentTx.wait();
            console.log(
                "Shipment started successfully:",
                startShipmentTx
            );
        } catch (error) {
            console.log(
                "Error while starting shipment:",
                error
            );
        }
    };

    const cancelShipment = async (cancelShipmentData) => {
    console.log("Cancelling shipment: ", cancelShipmentData);
    const { receiver, index } = cancelShipmentData;
    try {
        if (!window.ethereum) {
            return alert("Please install MetaMask.");
        }
        const accounts = await window.ethereum.request({
            method: "eth_accounts"
        });
        const web3Modal = new Web3Modal();
        const connection = await web3Modal.connect();
        const provider = new ethers.BrowserProvider(connection);
        const signer = await provider.getSigner();
        const contract = fetchContract(signer);
        const cancelShipmentTx = await contract.cancelShipment(
            accounts[0],
            receiver,
            index,
            {
                gasLimit: 300000
            }
        );
        await cancelShipmentTx.wait();
        console.log(
            "Shipment cancelled successfully:",
            cancelShipmentTx
        );
    } catch (error) {
        console.log(
            "Error while cancelling shipment:",
            error
        );
    }
};

const checkIfWalletIsConnected = async () => {
    try {
        if (!window.ethereum) return alert("Please install MetaMask.");
        const accounts = await window.ethereum.request({
            method: "eth_accounts"
        });
        if (accounts.length) {
            setCurrentUser(accounts[0]);
        } else {
            console.log("No accounts found");
        }
    } catch (error) {
        console.log("Error while checking wallet connection:", error);
    }
};

const connectWallet = async () => {
  try {
    if (!window.ethereum) return alert("Please install MetaMask.");
    const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
    });
    if (accounts.length) {
        setCurrentUser(accounts[0]);
    }
  } catch (error) {
    console.log("Error while connecting wallet:", error);
  }
};

useEffect(() => {
  checkIfWalletIsConnected();
}, []);


    return (
        <TrackingContext.Provider
            value={{
                title,
                currentUser,
                setCurrentUser,
                createShipment,
                getAllShipments,
                getShipmentsCount,
                completeShipment,
                getShipment,
                startShipment,
                cancelShipment,
                connectWallet
            }}
        >
            {children}
        </TrackingContext.Provider>
    );
};