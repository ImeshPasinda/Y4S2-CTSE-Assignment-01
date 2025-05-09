import React from 'react';
import CoursesTable from './coursesTable';
import Error from '../404/error';
import CryptoJS from "crypto-js";
import CourseContentsTable from './courseContentsTable';
import { AddIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { TabPanels, Tabs, TabPanel, Tab, TabList, IconButton, Menu, MenuButton, MenuItem, MenuList } from '@chakra-ui/react';
import { NAVIGATE_TO_ADD_COURSE, NAVIGATE_TO_ADD_COURSE_CONTENTS } from '../../constant/routeConstant';
import { Admin, Instructor } from '../../enums/enums';

export default function Dashboard() {

    const encryptedUData = localStorage.getItem('uData');
    const decryptedUData = CryptoJS.AES.decrypt(encryptedUData, process.env.REACT_APP_ENCRYPTION_SECRET).toString(CryptoJS.enc.Utf8);
    const uData = JSON.parse(decryptedUData);

    const isInstructor = uData?.role === Instructor;
    const isAdmin= uData?.role === Admin;

    return (
        <div className="container" style={{ marginTop: 120 }}>
            <Tabs>
                <TabList>
                    {isInstructor ? null : <Tab>Course</Tab>}
                    <Tab>Contents</Tab>
                    {isInstructor ? null : <Tab>Users</Tab>}
                    {isInstructor ? null : <Tab>Payments</Tab>}
                    <div style={{ marginLeft: '10px', marginBottom: '4px' }}>
                        <Menu>
                            <MenuButton
                                as={IconButton}
                                aria-label='Options'
                                icon={<AddIcon />}
                                variant='outline'
                            />
                            <MenuList>
                                {!isInstructor && (
                                    <MenuItem icon={<ExternalLinkIcon />} as="a" href={NAVIGATE_TO_ADD_COURSE}>
                                        Add Course
                                    </MenuItem>
                                )}
                                 {!isAdmin && (
                                <MenuItem icon={<ExternalLinkIcon />} as="a" href={NAVIGATE_TO_ADD_COURSE_CONTENTS} >
                                    Add Course Contents
                                </MenuItem>
                                )}
                            </MenuList>
                        </Menu>
                    </div>
                </TabList>

                <TabPanels>
                    {!isInstructor && (
                        <TabPanel>
                            <CoursesTable />
                        </TabPanel>
                    )}
                    <TabPanel>
                        <CourseContentsTable />
                    </TabPanel>
                    <TabPanel>
                        <Error />
                    </TabPanel>
                    <TabPanel>
                        <Error />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    );
}
